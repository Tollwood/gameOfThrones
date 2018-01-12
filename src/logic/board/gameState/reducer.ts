import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import {GamePhase} from '../gamePhase';
import {House} from '../house';
import VictoryRules from '../gameRules/victoryRules';
import Player from '../player';
import SupplyStateModificationService from './supplyStateModificationService';
import CardFactory from '../../cards/cardFactory';
import {AreaInitiator} from '../areaInitiator';
import AiPlayer from '../../ai/aiPlayer';
import {TSMap} from 'typescript-map';
import GamePhaseService from '../gamePhaseService';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {Area} from '../area';
import RecruitingStateModificationService from './recruitingStateModificationService';
import {AreaKey} from '../areaKey';
import AreaModificationService from './areaStateModificationService';
import StateSelectorService from '../gameRules/stateSelectorService';
import PlayerStateModificationService from './playerStateModificationService';
import {WesterosCard} from '../../cards/westerosCard';
import CardAbilities from '../../cards/cardAbilities';

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
    currentWesterosCard?: WesterosCard;
    westerosCards?: TSMap<GamePhase, WesterosCard[]>;
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
    areasAllowedToRecruit: [],
    currentWesterosCard: null,
    westerosCards: new TSMap<GamePhase, WesterosCard[]>(),
};

const gameStateReducer = (state: GameStoreState = initialState, action: ActionTypes): GameStoreState => {
    let newState;
    let areas: TSMap<AreaKey, Area>;
    switch (action.type) {

        // Game Changes
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

            areas = AreaInitiator.getInitalState(players.map(player => player.house));
            newState = {
                ...initialState,
                areas,
                players,
                currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(initialState),
                currentlyAllowedSupply: SupplyStateModificationService.updateSupply({players, areas}),
                westerosCards: CardFactory.getWesterosCards(),
            };
            break;
        case TypeKeys.RESET_GAME:
            newState = {...initialState};
            break;
        case TypeKeys.LOAD_GAME:
            newState = {...action.state};
            break;

        case TypeKeys.RECRUIT_UNITS:
            const areasAllowedToRecruit = RecruitingStateModificationService.updateAreasAllowedToRecruit(state.areasAllowedToRecruit, action.areaKey);
            newState = {
                ...state,
                areas: AreaModificationService.recruitUnits(state.areas.values(), action.areaKey, action.units),
                areasAllowedToRecruit: areasAllowedToRecruit,
                currentWesterosCard: areasAllowedToRecruit.length > 0 ? state.currentWesterosCard : null,
                ...GamePhaseService.updateGamePhaseAfterRecruiting(state, action.areaKey)
            };
            break;

        // planningPhase
        case TypeKeys.PLACE_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.addOrderToken(state.areas.values(), action.orderToken, action.areaKey),
                ...GamePhaseService.getNextPhaseAndPlayer(state, action.areaKey)
            };
            break;

        // Action Phase
        case TypeKeys.SKIP_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.removeOrderToken(state.areas.values(), action.areaKey),
                ...GamePhaseService.getNextPhaseAndPlayer(state, action.areaKey)
            };
            break;
        case TypeKeys.EXECUTE_RAID_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.removeOrderTokens(state.areas.values(), [action.sourceAreaKey, action.targetAreaKey]),
                players: PlayerStateModificationService.raidPowerToken(state, action.sourceAreaKey, action.targetAreaKey),
                ...GamePhaseService.getNextPhaseAndPlayer(state, action.sourceAreaKey)
            };
            break;
        case TypeKeys.PLAY_WESTEROS_CARD:
            newState = {...state, currentWesterosCard: action.card};
            break;

        case TypeKeys.EXECUTE_WESTEROS_CARD:
            let newWildlingCount: number;
            if (state.wildlingsCount + action.card.wildling >= 12) {
                newWildlingCount = 12;
            } else {
                newWildlingCount = state.wildlingsCount += action.card.wildling;
            }
            newState = {
                ...CardAbilities[action.card.selectedFunction.functionName](state),
                wildlingsCount: newWildlingCount
            };
            break;
        case TypeKeys.MOVE_UNITS:
            let winningHouse = VictoryRules.verifyWinningHouseAfterMove(state, state.areas.get(action.source).controllingHouse, action.target);
            newState = {
                ...state,
                areas: AreaModificationService.moveUnits(state.areas.values(), action.source, action.target, action.units, action.completeOrder, action.establishControl),
                players: PlayerStateModificationService.establishControl(state.players, action.establishControl, state.areas.get(action.source).controllingHouse),
                ...GamePhaseService.getNextPhaseAndPlayer(state, action.source),
                winningHouse,
            };
            break;
        case TypeKeys.RESOLVE_FIGHT:
            // TODO verify winning conditions
            const combatResult = action.combatResult;
            let loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            let winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            newState = {
                ...state,
                areas: AreaModificationService.updateAfterFight(state.areas.values(), combatResult.attackingArea.key, winningArea.key, loosingArea.key, winningArea.units),
            };
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