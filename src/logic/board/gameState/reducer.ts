import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import {GamePhase} from '../gamePhase';
import GameRules from '../gameRules/gameRules';
import TokenPlacementRules from '../gameRules/tokenPlacementRules';
import {House} from '../house';
import VictoryRules from '../gameRules/victoryRules';
import Player from '../player';
import SupplyRules from '../gameRules/supplyRules';
import CardFactory from '../../cards/cardFactory';
import {AreaInitiator} from '../areaInitiator';
import AiPlayer from '../../ai/aiPlayer';
import GameState from './GameState';
import {TSMap} from 'typescript-map';
import GamePhaseService from '../gamePhaseService';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {Area} from '../area';
import RecruitingStateModificationService from './recruitingStateModificationService';
import {AreaKey} from '../areaKey';
import AreaModificationService from './areaStateModificationService';
import StateSelectorService from '../gameRules/stateSelectorService';

class GameStoreState {
    areas?: TSMap<AreaKey, Area>;
    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;
    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    wildlingsCount?: number;
    players?: Array<Player>;
    localPlayersHouse?: House;
    currentHouse?: House;
    currentlyAllowedTokenTypes?: Array<OrderTokenType>;
    currentlyAllowedSupply?: TSMap<House, number>;
    areasAllowedToRecruit?: AreaKey[];
}
const initialIronThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
const initialKingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
const initialFiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
export const INITIALLY_ALLOWED_ORDER_TOKEN_TYPES = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special, OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special, OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
const INITIAL_POWER_TOKEN: number = 5;
const initialState: GameStoreState = {
    areas: null,
    gameRound: 1,
    gamePhase: GamePhase.WESTEROS1,
    winningHouse: null,
    fiefdom: initialFiefdom,
    kingscourt: initialKingscourt,
    ironThroneSuccession: initialIronThroneSuccession,
    wildlingsCount: 0,
    players: [],
    localPlayersHouse: House.stark,
    currentHouse: null,
    currentlyAllowedTokenTypes: INITIALLY_ALLOWED_ORDER_TOKEN_TYPES,
    areasAllowedToRecruit: []
};

const gameStateReducer = (state: GameStoreState = initialState, action: ActionTypes): GameStoreState => {
    let newState;
    let areas: TSMap<AreaKey, Area>;
    switch (action.type) {
        case TypeKeys.NEW_GAME:
            let player = [];
            action.playerSetup.forEach((config) => {
                if (config.ai) {
                    player.push(new AiPlayer(config.house, INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
                }
                else {
                    player.push(new Player(config.house, INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
                }
            });
            const gameState = new GameState();
            areas = AreaInitiator.getInitalState(player.map(player => player.house));
            gameState.westerosCards1 = CardFactory.getWesterosCards(1);
            gameState.westerosCards2 = CardFactory.getWesterosCards(2);
            gameState.westerosCards3 = CardFactory.getWesterosCards(3);
            const currentHouse = initialIronThroneSuccession[0];
            const updatedSupply = new TSMap<House, number>();
            player.forEach((player) => {
                updatedSupply.set(player.house, SupplyRules.calculateNumberOfSupply(player.house, areas.values()));
            });

            GameRules.load(gameState);
            newState = {
                ...initialState,
                areas,
                players: player,
                currentHouse,
                currentlyAllowedSupply: updatedSupply
            };
            break;
        case TypeKeys.RESET_GAME:
            newState = {...initialState};
            break;
        case TypeKeys.LOAD_GAME:
            newState = {...action.state};
            break;

        case TypeKeys.INCREASE_WILDLINGCOUNT:
            let newWildlingCount: number;
            if (state.wildlingsCount + action.by >= 12) {
                newWildlingCount = 12;
            } else {
                newWildlingCount = state.wildlingsCount += action.by;
            }
            newState = {...state, wildlingsCount: newWildlingCount};
            break;
        case TypeKeys.RESTRICT_ORDER_TOKEN:
            const currentlyAllowedTokenTypes = TokenPlacementRules.restrictOrderToken(state, action.notAllowedTokens);
            newState = {...state, currentlyAllowedTokenTypes};
            break;
        case TypeKeys.UPDATE_SUPPLY:
            newState = {...state, currentlyAllowedSupply: SupplyRules.updateSupply(state)};
            break;
        case TypeKeys.START_RECRUITING:
            newState = {
                ...state,
                areasAllowedToRecruit: RecruitingStateModificationService.calculateAreasAllowedToRecruit(state)
            };
            break;
        case TypeKeys.RECRUIT_UNITS:
            newState = {
                ...state,
                areas: AreaModificationService.recruitUnits(state.areas.values(), action.areaKey, action.units),
                areasAllowedToRecruit: RecruitingStateModificationService.updateAreasAllowedToRecruit(state.areasAllowedToRecruit, action.areaKey),
                currentHouse: GamePhaseService.nextHouse(state)
            };
            break;
        case TypeKeys.MOVE_UNITS:
            // TODO verify its a valid move before updating state
            newState = {
                ...state,
                areas: AreaModificationService.moveUnits(state.areas.values(), action.source, action.target, action.units, action.completeOrder, action.establishControl),
                players: TokenPlacementRules.establishControl(state.players, action.establishControl, state.areas.get(action.source).controllingHouse),
                currentHouse: GamePhaseService.nextHouse(state)
            };
            break;
        // these are no real actions and should be removed
        case TypeKeys.NEXT_PHASE:
            if (state.gamePhase === GamePhase.ACTION_CLEANUP) {
                const nextGameRound = state.gameRound + 1;
                let winningHouse = null;
                if (nextGameRound > 10) {
                    let sortedPlayersByVictoryPoints = state.players.sort((a, b) => {
                        return VictoryRules.getVictoryPositionFor(b.house) - VictoryRules.getVictoryPositionFor(a.house);
                    });
                    winningHouse = sortedPlayersByVictoryPoints[0].house;
                }
                newState = {
                    ...state,
                    areas: AreaModificationService.removeAllRemainingTokens(state.areas.values()),
                    gamePhase: GamePhase.WESTEROS1,
                    gameRound: nextGameRound,
                    winningHouse: winningHouse,
                    currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state),
                    currentlyAllowedTokenTypes: INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
                };
            } else {
                newState = {...state, gamePhase: state.gamePhase + 1};
            }
            break;
        case TypeKeys.PLACE_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.addOrderToken(state.areas.values(), action.orderToken, action.areaKey)
            };
            break;
        case TypeKeys.SKIP_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.removeOrderToken(state.areas.values(), action.areaKey),
                currentHouse: GamePhaseService.nextHouse(state)
            };
            break;
        case TypeKeys.EXECUTE_RAID_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.removeOrderTokens(state.areas.values(), [action.sourceAreaKey, action.targetAreaKey]),
                players: TokenPlacementRules.raidPowerToken(state, action.sourceAreaKey, action.targetAreaKey),
                currentHouse: GamePhaseService.nextHouse(state)
            };
            break;
        case TypeKeys.NEXT_PLAYER:
            newState = {...state, currentHouse: GamePhaseService.nextHouse(state)};
            break;
        default:
            newState = state;
            break;
    }
    // console.log({action, oldState: state, newState});
    return newState;
};

const gameStore: Store<GameStoreState> = createStore(gameStateReducer);

export {gameStore, GameStoreState};