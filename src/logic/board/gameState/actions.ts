import {GameStoreState} from './reducer';
export enum TypeKeys {
    NEXT_PHASE = 'NEXT_PHASE',
    INCREASE_WILDLINGCOUNT = 'INCREASE_WILDLINGCOUNT',
    RESET_GAME = 'RESET_GAME',
    LOAD_GAME = 'LOAD_GAME',
    OTHER_ACTION = '__any_other_action_type__'
}

export interface IncreaseWildlingCountAction {
    type: TypeKeys.INCREASE_WILDLINGCOUNT;
    by: number;
}

export interface LoadGameAction {
    type: TypeKeys.LOAD_GAME;
    state: GameStoreState;
}

export interface ResetGameAction {
    type: TypeKeys.RESET_GAME;
}

export interface OtherAction {
    type: TypeKeys.OTHER_ACTION;
}

export interface NextPhaseAction {
    type: TypeKeys.NEXT_PHASE;
}

export type ActionTypes =
    | ResetGameAction
    | NextPhaseAction
    | LoadGameAction
    | IncreaseWildlingCountAction
    | OtherAction;


export const increaseWildlingCount = (by: number): IncreaseWildlingCountAction => ({
    type: TypeKeys.INCREASE_WILDLINGCOUNT,
    by
});

export const resetGame = (): ResetGameAction => ({
    type: TypeKeys.RESET_GAME
});

export const loadGame = (state: GameStoreState): LoadGameAction => ({
    type: TypeKeys.LOAD_GAME,
    state: state
});

export const nextPhase = (): NextPhaseAction => ({
    type: TypeKeys.NEXT_PHASE
});