export enum TypeKeys {
    INC_GAMEROUND = "INC_GAMEROUND",
    RESET_GAME = "RESET_GAME",
    OTHER_ACTION = "__any_other_action_type__"
}

export interface IncrementGameRoundAction {
    type: TypeKeys.INC_GAMEROUND;
    by: number;
}

export interface ResetGameAction {
    type: TypeKeys.RESET_GAME;
}

export interface OtherAction {
    type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
    | IncrementGameRoundAction
    | ResetGameAction
    | OtherAction;


export const incrementGameRound = (by: number): IncrementGameRoundAction => ({
    type: TypeKeys.INC_GAMEROUND,
    by
});


export const resetGame = (): ResetGameAction => ({
    type: TypeKeys.RESET_GAME
});