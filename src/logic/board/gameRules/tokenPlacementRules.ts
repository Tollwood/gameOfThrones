import {OrderToken, OrderTokenType} from '../../orderToken/orderToken';
import {Area} from '../area';
import {House} from '../house';
import GamePhaseService from '../gamePhaseService';
import AreaRules from './AreaRules';
import GameRules from './gameRules';
import {AreaKey} from '../areaKey';
export default class TokenPlacementRules {

    public static RAID_ORDER_TOKENS = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
    public static MARCH_ORDER_TOKENS = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special];
    public static DEFEND_ORDER_TOKENS = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
    public static SUPPORT_ORDER_TOKENS = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
    public static CONSOLIDATE_POWER_ORDER_TOKENS = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];
    public static INITIALLY_ALLOWED_ORDER_TOKEN_TYPES = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special, OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special, OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];


    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = GameRules.getAreaByKey(areaKey);
        return area !== null && area.units.length > 0
            && area.controllingHouse === house
            && area.orderToken === null;
    }

    public static getPlacableOrderTokenTypes(house: House): Array<OrderTokenType> {
        let alreadyPlacedOrderTokens: Array<OrderTokenType> = GameRules.gameState.areas.filter((area) => {
            return area.orderToken && area.controllingHouse === house;
        }).map((area) => {
            return area.orderToken.getType();
        });

        return GameRules.gameState.currentlyAllowedTokenTypes.filter((type) => {
            return alreadyPlacedOrderTokens.indexOf(type) === -1;
        });
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: AreaKey) {
        const area = GameRules.getAreaByKey(areaKey);
        area.orderToken = ordertoken;
    }

    public static executeRaidOrder(source: AreaKey, target: AreaKey) {
        let sourceArea = GameRules.getAreaByKey(source);
        sourceArea.orderToken = null;
        const targetArea = GameRules.getAreaByKey(target);
        if (targetArea.orderToken.isConsolidatePowerToken()) {
            GameRules.gameState.players.filter((player) => {
                return player.house === targetArea.controllingHouse;
            }).map((player) => {
                if (player.powerToken > 0) {
                    player.powerToken--;
                }
            });
            GameRules.gameState.players.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0].powerToken++;
        }
        targetArea.orderToken = null;
        GamePhaseService.nextPlayer();
    }


    public static executeAllConsolidatePowerOrders() {
        return GameRules.gameState.areas.filter((area) => {
            return area.orderToken && area.orderToken.isConsolidatePowerToken();
        }).map((area) => {
            area.orderToken = null;
            let additionalPowerToken = area.consolidatePower + 1;
            let player = GameRules.gameState.players.filter((player) => {
                return player.house === area.controllingHouse;
            })[0];
            player.powerToken += additionalPowerToken;
        });
    }

    public static skipOrder(source: AreaKey) {
        let sourceArea = GameRules.getAreaByKey(source);
        sourceArea.orderToken = null;
        GamePhaseService.nextPlayer();
    }


    public static restrictOrderToken(notAllowedOrderTokenTypes: Array<OrderTokenType>) {
        GameRules.gameState.currentlyAllowedTokenTypes = GameRules.gameState.currentlyAllowedTokenTypes.filter(function (orderToken) {
            return notAllowedOrderTokenTypes.indexOf(orderToken) === -1;
        });
    }

    public static consolidateAllPower() {
        let gameState = GameRules.gameState;
        gameState.players.forEach((player) => {
            let additionalPower = 0;
            gameState.areas.forEach((area) => {
                if (area.controllingHouse === player.house) {
                    additionalPower += area.consolidatePower;
                }
            });
            player.powerToken += additionalPower;
        });
        // Add logic for ships in harbour
    }

    public static isAllowedToRaid(sourceArea: Area, targetArea: Area): boolean {
        return AreaRules.isConnectedArea(sourceArea, targetArea) && targetArea.controllingHouse !== null
            && sourceArea.controllingHouse !== targetArea.controllingHouse
            && (sourceArea.isLandArea && targetArea.isLandArea || !sourceArea.isLandArea);
    }
}