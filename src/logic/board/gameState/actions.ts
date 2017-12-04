import {GameStoreState} from './reducer';
import PlayerSetup from '../playerSetup';
import {OrderTokenType} from '../../orderToken/orderTokenType';
export enum TypeKeys {
    NEXT_PHASE = 'NEXT_PHASE',
    INCREASE_WILDLINGCOUNT = 'INCREASE_WILDLINGCOUNT',
    RESET_GAME = 'RESET_GAME',
    LOAD_GAME = 'LOAD_GAME',
    NEW_GAME = 'NEW_GAME',
    RESTRICT_ORDER_TOKEN = 'RESTRICT_ORDER_TOKEN',
        //not a real Action remove once all is moved to the store
    NEXT_PLAYER = 'NEXT_PLAYER',
    OTHER_ACTION = '__any_other_action_type__'
}

export interface RestrictOrderTokenTypesAction {
    type: TypeKeys.RESTRICT_ORDER_TOKEN;
    notAllowedTokens: OrderTokenType[];
}
export interface NextPlayerAction {
    type: TypeKeys.NEXT_PLAYER
}

export interface NewGameAction {
    type: TypeKeys.NEW_GAME;
    playerSetup: Array<PlayerSetup>;
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
    | NewGameAction
    | LoadGameAction
    | ResetGameAction
    | NextPhaseAction
    | IncreaseWildlingCountAction
    | RestrictOrderTokenTypesAction
    | OtherAction
    | NextPlayerAction;


export const resctrictOrderToken = (notAllowedTokens: OrderTokenType[]): RestrictOrderTokenTypesAction => ({
    type: TypeKeys.RESTRICT_ORDER_TOKEN,
    notAllowedTokens
});

export const increaseWildlingCount = (by: number): IncreaseWildlingCountAction => ({
    type: TypeKeys.INCREASE_WILDLINGCOUNT,
    by
});

export const resetGame = (): ResetGameAction => ({
    type: TypeKeys.RESET_GAME
});

export const newGame = (playerSetup: PlayerSetup[]): NewGameAction => ({
    type: TypeKeys.NEW_GAME,
    playerSetup

});
export const loadGame = (state: GameStoreState): LoadGameAction => ({
    type: TypeKeys.LOAD_GAME,
    state: state
});

export const nextPhase = (): NextPhaseAction => ({
    type: TypeKeys.NEXT_PHASE
});

export const nextPlayer = (): NextPlayerAction => ({
    type: TypeKeys.NEXT_PLAYER
});