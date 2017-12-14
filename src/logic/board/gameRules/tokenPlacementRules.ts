import {Area} from '../area';
import {House} from '../house';
import AreaRules from './AreaRules';
import GameRules from './gameRules';
import {AreaKey} from '../areaKey';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {gameStore, GameStoreState} from '../gameState/reducer';
import Player from '../player';
export default class TokenPlacementRules {

    public static RAID_ORDER_TOKENS = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
    public static MARCH_ORDER_TOKENS = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special];
    public static DEFEND_ORDER_TOKENS = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
    public static SUPPORT_ORDER_TOKENS = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
    public static CONSOLIDATE_POWER_ORDER_TOKENS = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];

    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = GameRules.getAreaByKey(areaKey);
        return area !== null && area.units.length > 0
            && area.controllingHouse === house
            && area.orderToken === null;
    }

    public static getPlacableOrderTokenTypes(house: House): Array<OrderTokenType> {
        let alreadyPlacedOrderTokens: Array<OrderTokenType> = gameStore.getState().areas.values().filter((area) => {
            return area.orderToken && area.controllingHouse === house;
        }).map((area) => {
            return area.orderToken.getType();
        });

        return gameStore.getState().currentlyAllowedTokenTypes.filter((type) => {
            return alreadyPlacedOrderTokens.indexOf(type) === -1;
        });
    }

    public static isAllowedToRaid(sourceArea: Area, targetArea: Area): boolean {
        return AreaRules.isConnectedArea(sourceArea, targetArea) && targetArea.controllingHouse !== null
            && sourceArea.controllingHouse !== targetArea.controllingHouse
            && (sourceArea.isLandArea && targetArea.isLandArea || !sourceArea.isLandArea);
    }


    public static executeAllConsolidatePowerOrders() {
        return gameStore.getState().areas.values().filter((area) => {
            return area.orderToken && area.orderToken.isConsolidatePowerToken();
        }).map((area) => {
            area.orderToken = null;
            let additionalPowerToken = area.consolidatePower + 1;
            let player = gameStore.getState().players.filter((player) => {
                return player.house === area.controllingHouse;
            })[0];
            player.powerToken += additionalPowerToken;
        });
    }

    // TODO immutable - do not modify state
    // TODO enable recruiting for special Power Token
    public static consolidateAllPower() {
        gameStore.getState().players.forEach((player) => {
            let additionalPower = 0;
            gameStore.getState().areas.values().forEach((area) => {
                if (area.controllingHouse === player.house) {
                    additionalPower += area.consolidatePower;
                }
            });
            player.powerToken += additionalPower;
        });
        // Add logic for ships in harbour
    }

    // Immutable state modification
    public static restrictOrderToken(state: GameStoreState, notAllowedOrderTokenTypes: Array<OrderTokenType>) {
        return state.currentlyAllowedTokenTypes.filter(function (orderToken) {
            return notAllowedOrderTokenTypes.indexOf(orderToken) === -1;
        });
    }

    public static raidPowerToken(state: GameStoreState, source: AreaKey, target: AreaKey): Player[] {

        const targetArea = state.areas.get(target);
        const sourceArea = state.areas.get(source);
        if (targetArea.orderToken.isConsolidatePowerToken()) {
            const newPlayers = state.players.splice(0);
            newPlayers.filter((player) => {
                return player.house === targetArea.controllingHouse;
            }).map((player) => {
                if (player.powerToken > 0) {
                    player.powerToken--;
                }
            });
            newPlayers.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0].powerToken++;

            return newPlayers;
        }
        return state.players;
    }

    public static establishControl(players: Player[], establishControl: boolean, house: House): Player[] {
        if (establishControl) {
            const newPlayers = players.splice(0);
            newPlayers.filter((player) => {
                return player.house === house;
            })[0].powerToken--;
            return newPlayers;
        }
        return players;
    }
}