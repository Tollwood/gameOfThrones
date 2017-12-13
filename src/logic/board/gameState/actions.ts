import {GameStoreState} from './reducer';
import PlayerSetup from '../playerSetup';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {Area} from '../area';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
import Order = jasmine.Order;
export enum TypeKeys {
    NEXT_PHASE = 'NEXT_PHASE',
    INCREASE_WILDLINGCOUNT = 'INCREASE_WILDLINGCOUNT',
    START_RECRUITING = 'START_RECRUITING',
    RECRUIT_UNITS = 'RECRUIT_UNITS',
    MOVE_UNITS = 'MOVE_UNITS',
    SKIP_ORDER = 'SKIP_ORDER',
    PLACE_ORDER = 'PLACE_ORDER',
    RESET_GAME = 'RESET_GAME',
    LOAD_GAME = 'LOAD_GAME',
    NEW_GAME = 'NEW_GAME',
    RESTRICT_ORDER_TOKEN = 'RESTRICT_ORDER_TOKEN',
    UPDATE_SUPPLY = 'UPDATE_SUPPLY',
        // not a real Action remove once all is moved to the store
    NEXT_PLAYER = 'NEXT_PLAYER',
    OTHER_ACTION = '__any_other_action_type__'
}

export interface SkipOrderAction {
    type: TypeKeys.SKIP_ORDER;
    areaKey: AreaKey;
}
export interface  PlaceOrderAction {
    type: TypeKeys.PLACE_ORDER;
    areaKey: AreaKey;
    orderToken: OrderToken;
}
export interface  RecruitUnitsAction {
    type: TypeKeys.RECRUIT_UNITS;
    area: Area;
    units: UnitType[];
}

export interface MoveUnitsAction {
    type: TypeKeys.MOVE_UNITS;
    source: AreaKey;
    target: AreaKey;
    units: Unit[];
    completeOrder: boolean;
    establishControl: boolean;
}

export interface StartRecruitingAction {
    type: TypeKeys.START_RECRUITING;
}
export interface UpdateSupplyAction {
    type: TypeKeys.UPDATE_SUPPLY;
}

export interface RestrictOrderTokenTypesAction {
    type: TypeKeys.RESTRICT_ORDER_TOKEN;
    notAllowedTokens: OrderTokenType[];
}
export interface NextPlayerAction {
    type: TypeKeys.NEXT_PLAYER;
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
    | StartRecruitingAction
    | RecruitUnitsAction
    | MoveUnitsAction
    | PlaceOrderAction
    | SkipOrderAction
    | IncreaseWildlingCountAction
    | RestrictOrderTokenTypesAction
    | UpdateSupplyAction
    | OtherAction
    | NextPlayerAction;


export const skipOrder = (areaKey: AreaKey): SkipOrderAction => ({
    type: TypeKeys.SKIP_ORDER,
    areaKey
});
export const placeOrder = (areaKey: AreaKey, orderToken: OrderToken): PlaceOrderAction => ({
    type: TypeKeys.PLACE_ORDER,
    areaKey,
    orderToken
});
export const startRecruiting = (): StartRecruitingAction => ({
    type: TypeKeys.START_RECRUITING,
});


export const moveUnits = (source: AreaKey, target: AreaKey, units: Unit[] = [], completeOrder: boolean = true, establishControl: boolean = false): MoveUnitsAction => ({
    type: TypeKeys.MOVE_UNITS,
    source,
    target,
    units,
    completeOrder,
    establishControl
});

export const recruitUnits = (area: Area, units: UnitType[] = []): RecruitUnitsAction => ({
    type: TypeKeys.RECRUIT_UNITS,
    area,
    units
});
export const updateSupply = (): UpdateSupplyAction => ({
    type: TypeKeys.UPDATE_SUPPLY,
});

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