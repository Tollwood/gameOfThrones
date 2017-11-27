import {AnyAction, combineReducers, createStore, Store, Reducer} from 'redux';
import {Area} from '../area';
import {ActionTypes, TypeKeys} from './actions';

function GameRoundReducer(state: number = 0, action: ActionTypes): number {
    switch (action.type) {
        case TypeKeys.INC_GAMEROUND:
            return state + action.by;

        default:
            return state;
    }
}
function AreaReducer(state: Area[] = [], action: AnyAction): Area[] {
    return state;
}

type GameState = { gameRound: number, areas: Area[] };

const gameReducer: Reducer<GameState> = combineReducers({gameRound: GameRoundReducer, areas: AreaReducer});

const rootReducer = (state, action: ActionTypes) => {
    if (action.type === TypeKeys.RESET_GAME) {
        state = undefined
    }
    return gameReducer(state, action)
};

const gameStore: Store<GameState> = createStore(rootReducer);

export {gameStore};