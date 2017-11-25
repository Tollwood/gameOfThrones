import {Area} from '../board/area';
import {House} from '../board/house';
import PossibleMove from './possibleMove';
import MovementRules from '../board/gameRules/movementRules';
import {OrderTokenType} from '../orderToken/orderTokenType';
export default class AiCalculator {

    public controlledByOtherPlayerWithEnemyUnits(area: Area, house: House) {
        return area.controllingHouse !== null && area.controllingHouse !== house && area.units.length > 0;
    }

    public static unOccupiedOrNoEnemies(area: Area, house: House) {
        return (area.controllingHouse === null || area.controllingHouse !== null && area.controllingHouse !== house) && area.units.length === 0;
    }

    public static getAreasForHouseWithToken(areas: Area[], house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    public getBestMove(currentHouse: House, area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(currentHouse, area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }


    private getAllPossibleMoves(currentHouse: House, area: Area, availableOrderToken: Array<OrderTokenType>): PossibleMove[] {
        let possibleMoves = [];
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForConsolidatePowerOrder()));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForDefendingOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForSupportOrder()));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    // TODO: Filter areas where it is allowed to raid (land units can not raid sea areas)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForRaidOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    MovementRules.getAllAreasAllowedToMarchTo(area).forEach((possibleArea) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForMarchOrders(area, possibleArea, currentHouse), possibleArea));

                    });
                    break;
            }

        });
        return possibleMoves;
    }

    private calculateValueForDefendingOrders(area: Area, currentHouse: House, factor: number): number {
        let value = 0;
        area.borders
            .forEach((borderArea) => {
                let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== currentHouse && borderArea.units.length > 0;
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private calculateValueForRaidOrders(area: Area, currentHouse: House, factor: number) {

        let value = 0;
        area.borders
            .forEach((borderArea) => {
                let controlledByOtherPlayerWithEnemyUnits = this.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private calculateValueForConsolidatePowerOrder(): number {
        return 0.1;
    }

    private calculateValueForSupportOrder(): number {
        return 0;
    }

    private calculateValueForMarchOrders(sourceArea: Area, targetArea: Area, currentHouse: House) {
        let value = 0;
        let numberOfEnemiesAtBorder = sourceArea.borders
            .filter((borderArea) => {
                return this.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
            }).length;

        let unOccupiedOrNoEnemies = AiCalculator.unOccupiedOrNoEnemies(targetArea, currentHouse);
        if (targetArea.hasCastleOrStronghold() && unOccupiedOrNoEnemies) {
            value += 0.9;
        }
        if (targetArea.supply > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetArea.supply);
        }
        if (targetArea.consolidatePower > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetArea.consolidatePower);
        }
        value -= (numberOfEnemiesAtBorder * 0.1);

        return value;
    }

}