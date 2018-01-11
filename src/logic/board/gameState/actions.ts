import {GameStoreState} from './reducer';
import PlayerSetup from '../playerSetup';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
import CombatResult from '../../march/combatResult';

export enum TypeKeys {
    RESET_GAME = 'RESET_GAME',
    LOAD_GAME = 'LOAD_GAME',
    NEW_GAME = 'NEW_GAME',

    INCREASE_WILDLINGCOUNT = 'INCREASE_WILDLINGCOUNT',
    RECRUIT_UNITS = 'RECRUIT_UNITS',
    START_RECRUITING = 'START_RECRUITING',
    RESTRICT_ORDER_TOKEN = 'RESTRICT_ORDER_TOKEN',
    UPDATE_SUPPLY = 'UPDATE_SUPPLY',
    CONSOLIDATE_ALL_POWER = 'CONSOLIDATE_ALL_POWER',


    PLACE_ORDER = 'PLACE_ORDER',
    SKIP_ORDER = 'SKIP_ORDER',
    MOVE_UNITS = 'MOVE_UNITS',
    RESOLVE_FIGHT = 'RESOLVE_FIGHT',
    EXECUTE_RAID_ORDER = 'EXECUTE_RAID_ORDER',

    OTHER_ACTION = '__any_other_action_type__'
}

export interface ResolveFightAction {
    type: TypeKeys.RESOLVE_FIGHT;
    combatResult: CombatResult;
}

export interface ConsolidateAllPowerAction {
    type: TypeKeys.CONSOLIDATE_ALL_POWER;
}
export interface ExecuteRaidOrderAction {
    type: TypeKeys.EXECUTE_RAID_ORDER;
    sourceAreaKey: AreaKey;
    targetAreaKey: AreaKey;
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
    areaKey: AreaKey;
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

export type ActionTypes =
    | NewGameAction
    | LoadGameAction
    | ResetGameAction
    | StartRecruitingAction
    | RecruitUnitsAction
    | MoveUnitsAction
    | ResolveFightAction
    | PlaceOrderAction
    | SkipOrderAction
    | ExecuteRaidOrderAction
    | ConsolidateAllPowerAction
    | IncreaseWildlingCountAction
    | RestrictOrderTokenTypesAction
    | UpdateSupplyAction
    | OtherAction;


export const resolveFight = (combatResult: CombatResult): ResolveFightAction => ({
    type: TypeKeys.RESOLVE_FIGHT,
    combatResult
});

export const consolidateAllPower = (): ConsolidateAllPowerAction => ({
    type: TypeKeys.CONSOLIDATE_ALL_POWER
});

export const executeRaidOrder = (sourceAreaKey: AreaKey, targetAreaKey: AreaKey): ExecuteRaidOrderAction => ({
    type: TypeKeys.EXECUTE_RAID_ORDER,
    sourceAreaKey,
    targetAreaKey
});

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

export const recruitUnits = (areaKey: AreaKey, units: UnitType[] = []): RecruitUnitsAction => ({
    type: TypeKeys.RECRUIT_UNITS,
    areaKey,
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