import {Area} from '../board/logic/area';
import {House} from '../board/logic/house';
import GameState from '../board/logic/gameStati';
import {OrderTokenType} from '../orderToken/logic/orderToken';
import PossibleMove from './possibleMove';
import AiPlayer from './aiPlayer';
import GameRules from '../board/logic/gameRules';
export default class AiCalculator {

    public static controlledByOtherPlayerWithEnemyUnits(area: Area, house: House) {
        return area.controllingHouse !== null && area.controllingHouse !== house && area.units.length > 0;
    }

    public static noEnemies(area: Area, house: House) {
        return (area.controllingHouse === null || area.controllingHouse !== null && area.controllingHouse !== house) && area.units.length === 0;
    }

    public static getAreasWithToken(house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return GameState.getInstance().areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    private static getAllPossibleMoves(aiPlayer: AiPlayer, area: Area, availableOrderToken: Array<OrderTokenType>) {
        let possibleMoves = new Array<PossibleMove>();
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    // TODO Add logic when to consolidate power
                    possibleMoves.push(new PossibleMove(orderTokenType, area, aiPlayer.calculateValueForConsolidatePowerOrder(area)));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, aiPlayer.calculateValueForDefendingOrders(area)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    // TODO add logic when to support units (this feature is not yet implemented in the game)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, aiPlayer.calculateValueForSupportOrder(area)));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    // TODO: Filter areas where it is allowed to raid (land units can not raid sea areas)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, aiPlayer.calculateValueForRaidOrders(area)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    GameRules.getAllAreasAllowedToMarchTo(area).forEach((possibleArea) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area, aiPlayer.calculateValueForMarchOrders(area, possibleArea), possibleArea));

                    });
                    break;
            }

        });
        return possibleMoves;
    }

    public static getBestMove(aiPlayer: AiPlayer, area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(aiPlayer, area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }
}