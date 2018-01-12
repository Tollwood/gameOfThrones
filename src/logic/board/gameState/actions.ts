import PlayerSetup from '../playerSetup';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
import CombatResult from '../../march/combatResult';
import {WesterosCard} from '../../cards/westerosCard';
import {GameStoreState} from './gameStoreState';

export enum TypeKeys {
    LOAD_GAME = 'LOAD_GAME',
    NEW_GAME = 'NEW_GAME',

    PLAY_WESTEROS_CARD = 'PLAY_WESTEROS_CARD',
    EXECUTE_WESTEROS_CARD = 'EXECUTE_WESTEROS_CARD',

    RECRUIT_UNITS = 'RECRUIT_UNITS',

    PLACE_ORDER = 'PLACE_ORDER',
    SKIP_ORDER = 'SKIP_ORDER',
    EXECUTE_RAID_ORDER = 'EXECUTE_RAID_ORDER',
    MOVE_UNITS = 'MOVE_UNITS',
    RESOLVE_FIGHT = 'RESOLVE_FIGHT',

    OTHER_ACTION = '__any_other_action_type__'
}

export interface PlayWesterosCardAction {
    type: TypeKeys.PLAY_WESTEROS_CARD;
    card: WesterosCard;
}

export interface ExecuteWesterosCardAction {
    type: TypeKeys.EXECUTE_WESTEROS_CARD;
    card: WesterosCard;
}

export interface ResolveFightAction {
    type: TypeKeys.RESOLVE_FIGHT;
    combatResult: CombatResult;
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

export interface PlaceOrderAction {
    type: TypeKeys.PLACE_ORDER;
    areaKey: AreaKey;
    orderToken: OrderToken;
}

export interface RecruitUnitsAction {
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

export interface NewGameAction {
    type: TypeKeys.NEW_GAME;
    playerSetup: Array<PlayerSetup>;
}

export interface LoadGameAction {
    type: TypeKeys.LOAD_GAME;
    state: GameStoreState;
}

export interface OtherAction {
    type: TypeKeys.OTHER_ACTION;
}

export type ActionTypes =
    | NewGameAction
    | LoadGameAction
    | RecruitUnitsAction
    | MoveUnitsAction
    | ResolveFightAction
    | PlaceOrderAction
    | SkipOrderAction
    | ExecuteRaidOrderAction
    | ExecuteWesterosCardAction
    | PlayWesterosCardAction
    | OtherAction;

export const playWesterosCard = (card: WesterosCard): PlayWesterosCardAction => ({
    type: TypeKeys.PLAY_WESTEROS_CARD,
    card
});

export const executeWesterosCard = (card: WesterosCard): ExecuteWesterosCardAction => ({
    type: TypeKeys.EXECUTE_WESTEROS_CARD,
    card
});

export const resolveFight = (combatResult: CombatResult): ResolveFightAction => ({
    type: TypeKeys.RESOLVE_FIGHT,
    combatResult
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

export const newGame = (playerSetup: PlayerSetup[]): NewGameAction => ({
    type: TypeKeys.NEW_GAME,
    playerSetup

});
export const loadGame = (state: GameStoreState): LoadGameAction => ({
    type: TypeKeys.LOAD_GAME,
    state: state
});