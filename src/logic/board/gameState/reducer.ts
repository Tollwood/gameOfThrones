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
import RecruitingRules from '../gameRules/recruitingRules';

class GameStoreState {
    areas?: Area[];
    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;
    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    wildlingsCount?: number;
    players?: Array<Player>;
    currentPlayer?: Player;
    currentlyAllowedTokenTypes?: Array<OrderTokenType>;
    currentlyAllowedSupply?: TSMap<House, number>;
    areasAllowedToRecruit?: Area[];
}
const initialIronThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
const initialKingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
const initialFiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
export const INITIALLY_ALLOWED_ORDER_TOKEN_TYPES = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special, OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special, OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
const INITIAL_POWER_TOKEN: number = 5;
const initialState: GameStoreState = {
    areas: [],
    gameRound: 1,
    gamePhase: GamePhase.WESTEROS1,
    winningHouse: null,
    fiefdom: initialFiefdom,
    kingscourt: initialKingscourt,
    ironThroneSuccession: initialIronThroneSuccession,
    wildlingsCount: 0,
    players: [],
    currentPlayer: null,
    currentlyAllowedTokenTypes: INITIALLY_ALLOWED_ORDER_TOKEN_TYPES,
    areasAllowedToRecruit: []
};

const gameStateReducer = (state: GameStoreState = initialState, action: ActionTypes): GameStoreState => {
    let newState;
    let areas;
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
            const currentPlayer = player.filter((player) => {
                return player.house === initialIronThroneSuccession[0];
            })[0];
            const updatedSupply = new TSMap<House, number>();
            player.forEach((player) => {
                updatedSupply.set(player.house, SupplyRules.getNumberOfSupply(player.house, areas));
            });

            GameRules.load(gameState);
            newState = {
                ...initialState,
                areas,
                players: player,
                currentPlayer,
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
            newState = {...state, areasAllowedToRecruit: RecruitingRules.setAreasAllowedToRecruit(state)};
            break;
        case TypeKeys.RECRUIT_UNITS:
            areas = RecruitingRules.recruit(state, action.area, action.units);
            newState = {
                ...state,
                areasAllowedToRecruit: RecruitingRules.setAreasAllowedToRecruit(state),
                currentPlayer: GamePhaseService.nextPlayer(state)
            };
            break;
        // these are no real actions and should be removed
        case TypeKeys.NEXT_PHASE:
            if (state.gamePhase === GamePhase.ACTION_CLEANUP) {
                gameStore.getState().areas.map((area) => {
                    area.orderToken = null;
                });
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
                    gamePhase: GamePhase.WESTEROS1,
                    gameRound: nextGameRound,
                    winningHouse: winningHouse,
                    currentPlayer: GameRules.getFirstFromIronThroneSuccession(),
                    currentlyAllowedTokenTypes: INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
                };
            } else {
                newState = {...state, gamePhase: state.gamePhase + 1};
            }
            break;
        case TypeKeys.NEXT_PLAYER:
            newState = {...state, currentPlayer: GamePhaseService.nextPlayer(state)};
            break;
        default:
            newState = state;
            break;
    }
    return newState;
};

const gameStore: Store<GameStoreState> = createStore(gameStateReducer);

export {gameStore, GameStoreState};