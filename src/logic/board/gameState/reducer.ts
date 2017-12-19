import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import {GamePhase} from '../gamePhase';
import GameRules from '../gameRules/gameRules';
import {House} from '../house';
import VictoryRules from '../gameRules/victoryRules';
import Player from '../player';
import SupplyStateModificationService from './supplyStateModificationService';
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
import PlayerStateModificationService from './playerStateModificationService';

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
            let players = [];
            action.playerSetup.forEach((config) => {
                if (config.ai) {
                    players.push(new AiPlayer(config.house, INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
                }
                else {
                    players.push(new Player(config.house, INITIAL_POWER_TOKEN, CardFactory.getHouseCards(config.house)));
                }
            });
            const gameState = new GameState();
            gameState.westerosCards1 = CardFactory.getWesterosCards(1);
            gameState.westerosCards2 = CardFactory.getWesterosCards(2);
            gameState.westerosCards3 = CardFactory.getWesterosCards(3);

            areas = AreaInitiator.getInitalState(players.map(player => player.house));
            GameRules.load(gameState);
            newState = {
                ...initialState,
                areas,
                players,
                currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(initialState),
                currentlyAllowedSupply: SupplyStateModificationService.updateSupply({players, areas})
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
            const currentlyAllowedTokenTypes = state.currentlyAllowedTokenTypes.filter(function (orderToken) {
                return action.notAllowedTokens.indexOf(orderToken) === -1;
            });
            newState = {...state, currentlyAllowedTokenTypes};
            break;
        case TypeKeys.UPDATE_SUPPLY:
            newState = {...state, currentlyAllowedSupply: SupplyStateModificationService.updateSupply(state)};
            break;
        case TypeKeys.CONSOLIDATE_ALL_POWER:
            newState = {...state, players: PlayerStateModificationService.consolidateAllPower(state)};
            break;

        case TypeKeys.START_RECRUITING:
            newState = {
                ...state,
                areasAllowedToRecruit: RecruitingStateModificationService.calculateAreasAllowedToRecruit(state)
            };
            break;
        case TypeKeys.RECRUIT_UNITS:
            // TODO verify if all units area recruited and switch to next Phase
            newState = {
                ...state,
                areas: AreaModificationService.recruitUnits(state.areas.values(), action.areaKey, action.units),
                areasAllowedToRecruit: RecruitingStateModificationService.updateAreasAllowedToRecruit(state.areasAllowedToRecruit, action.areaKey),
                currentHouse: GamePhaseService.nextHouse(state)
            };
            break;
        case TypeKeys.MOVE_UNITS:
            // TODO verify its a valid move before updating state
            // FIXME it looks like one of the methods sets players to an empty array!
            // moveUnits
            // establishControl
            // nextHouse
            let winningHouse = VictoryRules.verifyWinningHouseAfterMove(state, state.areas.get(action.source).controllingHouse, action.target);
            newState = {
                ...state,
                areas: AreaModificationService.moveUnits(state.areas.values(), action.source, action.target, action.units, action.completeOrder, action.establishControl),
                players: PlayerStateModificationService.establishControl(state.players, action.establishControl, state.areas.get(action.source).controllingHouse),
                currentHouse: GamePhaseService.nextHouse(state),
                winningHouse: winningHouse,
            };
            break;
        // these are no real actions and should be removed
        case TypeKeys.NEXT_PHASE:
            if (state.gamePhase === GamePhase.ACTION_CLEANUP) {
                winningHouse = VictoryRules.getWinningHouse(state);
                newState = {
                    ...state,
                    areas: AreaModificationService.removeAllRemainingTokens(state.areas.values()),
                    players: PlayerStateModificationService.executeAllConsolidatePowerOrders(state),
                    gamePhase: GamePhase.WESTEROS1,
                    gameRound: state.gameRound + 1,
                    winningHouse: winningHouse,
                    currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state),
                    currentlyAllowedTokenTypes: INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
                };
            } else {
                newState = {
                    ...state,
                    gamePhase: state.gamePhase + 1,
                    currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state)
                };
            }
            break;
        case TypeKeys.PLACE_ORDER:
            // TODO Move to stateModificationService
            let nextPhaseState = {};
            if (GamePhaseService.isPlanningPhaseComplete(state.areas.values(), action.areaKey)) {
                nextPhaseState = {
                    gamePhase: state.gamePhase + 1,
                    currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state)
                };
            }

            newState = {
                ...state,
                areas: AreaModificationService.addOrderToken(state.areas.values(), action.orderToken, action.areaKey),
                ...nextPhaseState
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
                players: PlayerStateModificationService.raidPowerToken(state, action.sourceAreaKey, action.targetAreaKey),
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