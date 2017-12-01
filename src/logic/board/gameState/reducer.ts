import {createStore, Store} from 'redux';
import {ActionTypes, TypeKeys} from './actions';
import {GamePhase} from '../gamePhase';
import GameRules from '../gameRules/gameRules';
import TokenPlacementRules from '../gameRules/tokenPlacementRules';
import {House} from '../house';
import VictoryRules from '../gameRules/victoryRules';

class GameStoreState {
    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;
    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    wildlingsCount?: number;
}
const initialIronThroneSuccession = [House.baratheon, House.lannister, House.stark, House.martell, House.tyrell, House.greyjoy];
const initialKingscourt = [House.lannister, House.stark, House.martell, House.baratheon, House.tyrell, House.greyjoy];
const initialFiefdom = [House.greyjoy, House.tyrell, House.martell, House.stark, House.baratheon, House.greyjoy];
const initialState: GameStoreState = {
    gameRound: 1,
    gamePhase: GamePhase.WESTEROS1,
    winningHouse: null,
    fiefdom: initialFiefdom,
    kingscourt: initialKingscourt,
    ironThroneSuccession: initialIronThroneSuccession,
    wildlingsCount: 0
};

const gameStateReducer = (state: GameStoreState = initialState, action: ActionTypes): GameStoreState => {
    let newState;
    switch (action.type) {
        case TypeKeys.RESET_GAME:
            newState = {...initialState};
            break;
        case TypeKeys.LOAD_GAME:
            newState = {...action.state};
            break;
        case TypeKeys.NEXT_PHASE:
            if (state.gamePhase === GamePhase.ACTION_CLEANUP) {
                const gameState = GameRules.gameState;
                gameState.areas.map((area) => {
                    area.orderToken = null;
                });
                gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
                gameState.currentPlayer = GameRules.getFirstFromIronThroneSuccession();

                const nextGameRound = state.gameRound + 1;
                let winningHouse = null;
                if (nextGameRound > 10) {
                    let sortedPlayersByVictoryPoints = gameState.players.sort((a, b) => {
                        return VictoryRules.getVictoryPositionFor(b.house) - VictoryRules.getVictoryPositionFor(a.house);
                    });
                    winningHouse = sortedPlayersByVictoryPoints[0].house;
                }
                newState = {
                    ...state,
                    gamePhase: GamePhase.WESTEROS1,
                    gameRound: nextGameRound,
                    winningHouse: winningHouse
                };
            } else {
                newState = {...state, gamePhase: state.gamePhase + 1};
            }
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
        default:
            newState = state;
            break;
    }
    return newState;
};

const gameStore: Store<GameStoreState> = createStore(gameStateReducer);

export {gameStore, GameStoreState};