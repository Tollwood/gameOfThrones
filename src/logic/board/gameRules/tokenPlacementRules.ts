import {Area} from '../area';
import {House} from '../house';
import {AreaKey} from '../areaKey';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {gameStore, GameStoreState} from '../gameState/reducer';
import StateSelectorService from './stateSelectorService';
export default class TokenPlacementRules {

    public static RAID_ORDER_TOKENS = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
    public static MARCH_ORDER_TOKENS = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special];
    public static DEFEND_ORDER_TOKENS = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
    public static SUPPORT_ORDER_TOKENS = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
    public static CONSOLIDATE_POWER_ORDER_TOKENS = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];

    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = StateSelectorService.getAreaByKey(areaKey);
        return area !== null && area.units.length > 0
            && area.controllingHouse === house
            && area.orderToken === null;
    }

    public static getPlacableOrderTokenTypes(state: GameStoreState, house: House): Array<OrderTokenType> {
        let alreadyPlacedOrderTokens: Array<OrderTokenType> = state.areas.values().filter((area) => {
            return area.orderToken && area.controllingHouse === house;
        }).map((area) => {
            return area.orderToken.getType();
        });

        return gameStore.getState().currentlyAllowedTokenTypes.filter((type) => {
            return alreadyPlacedOrderTokens.indexOf(type) === -1;
        });
    }

    public static isAllowedToRaid(sourceArea: Area, targetArea: Area): boolean {
        return this.isConnectedArea(sourceArea, targetArea) && targetArea.controllingHouse !== null
            && sourceArea.controllingHouse !== targetArea.controllingHouse
            && (sourceArea.isLandArea && targetArea.isLandArea || !sourceArea.isLandArea);
    }

    public static isConnectedArea(source: Area, target: Area): boolean {
        return source.borders.filter((area) => {
                return area.key === target.key;
            }).length === 1;
    }
}