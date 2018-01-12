import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import VictoryRules from '../gameRules/victoryRules';
import {TSMap} from 'typescript-map';
import GamePhaseService from '../gamePhaseService';
import {Area} from '../area';
import RecruitingStateModificationService from './recruitingStateModificationService';
import {AreaKey} from '../areaKey';
import AreaModificationService from './areaStateModificationService';
import PlayerStateModificationService from './playerStateModificationService';
import CardAbilities from '../../cards/cardAbilities';
import {GameStoreState} from './gameStoreState';
import WildlingStateModificationService from './wildlingStateModificationService';
import GameStateModificationService from './gameStateModificationService';


const gameStateReducer = (state: GameStoreState = {}, action: ActionTypes): GameStoreState => {
    let newState;
    let areas: TSMap<AreaKey, Area>;
    switch (action.type) {
        case TypeKeys.NEW_GAME:
            newState = {
                ...GameStateModificationService.init(action.playerSetup)
            };
            break;
        case TypeKeys.LOAD_GAME:
            newState = {...action.state};
            break;
        case TypeKeys.RECRUIT_UNITS:
            const areasAllowedToRecruit = RecruitingStateModificationService.updateAreasAllowedToRecruit(state.areasAllowedToRecruit, action.areaKey);
            const currentWesterosCard = areasAllowedToRecruit.length > 0 ? state.currentWesterosCard : null;
            newState = {
                ...state,
                areas: AreaModificationService.recruitUnits(state.areas.values(), action.areaKey, action.units),
                areasAllowedToRecruit,
                currentWesterosCard,
                ...GamePhaseService.updateGamePhaseAfterRecruiting(state, action.areaKey)
            };
            break;

        case TypeKeys.PLACE_ORDER:
            newState = {
                ...state,
                areas: AreaModificationService.addOrderToken(state.areas.values(), action.orderToken, action.areaKey),
                ...GamePhaseService.getNextPhaseAndPlayer(state, action.areaKey)
            };
            break;

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
            newState = {
                ...CardAbilities[action.card.selectedFunction.functionName](state),
                wildlingsCount: WildlingStateModificationService.updateWildlingCount(state.wildlingsCount, action.card.wildling)
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
            const loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
            const winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
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

export {gameStore};