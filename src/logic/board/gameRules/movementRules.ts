import {Area, AreaKey} from '../area';
import Unit from '../../units/units';
import AreaRules from './AreaRules';
import SupplyRules from './supplyRules';
import CombatResult from '../../march/combatResult';
import {CardExecutionPoint} from '../../cards/cardExecutionPoint';
import CombatCalculator from '../../march/combatCalculator';
import GameRules from './gameRules';
export default class MovementRules {

    public static moveUnits(source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true, establishControl: boolean = false) {

        let sourceArea = GameRules.getAreaByKey(source);
        let targetArea = GameRules.getAreaByKey(target);

        targetArea.units = targetArea.units.concat(movingUnits);
        targetArea.controllingHouse = sourceArea.controllingHouse;

        let remainingUnits = sourceArea.units.filter(function (sourceUnit) {
            return movingUnits.indexOf(sourceUnit) === -1;
        });
        sourceArea.units = remainingUnits;
        if (sourceArea.units.length === 0) {
            sourceArea.controllingHouse = null;
        }
        if (completeOrder) {
            sourceArea.orderToken = null;
        }
        if (completeOrder && establishControl) {
            sourceArea.controllingHouse = targetArea.controllingHouse;
        }
    }

    public static isAllowedToMove(source: Area, target: Area, unit: Unit): boolean {
        let hasUnitsToMove = source.units.length > 0;
        let moveOnLand = target.isLandArea && unit && unit.isLandunit();
        let moveOnSea = !target.isLandArea && unit && !unit.isLandunit();
        let unoccupiedArea = target.controllingHouse === null;
        let enmiesInTargetAreas = !unoccupiedArea  && target.units.length > 0 && source.controllingHouse !== target.controllingHouse;
        let hasUnitOfSameTypeToMove = source.units.filter((unitToCheck) => {
                return unitToCheck.getHouse() === unit.getHouse() && unitToCheck.getType() === unit.getType();
            }).length > 0;

        let connectedUsingShipTransport = this.connectedUsingShipTransport(source, target);
        let enoughSupplyForArmySize = this.enoughSupplyForArmySize(source, target);
        return source.key !== target.key
            && hasUnitsToMove
            && hasUnitOfSameTypeToMove
            && (AreaRules.isConnectedArea(source, target) || connectedUsingShipTransport)
            && (moveOnLand || moveOnSea)
            && !enmiesInTargetAreas
            && enoughSupplyForArmySize;
    }


    public static connectedUsingShipTransport(source: Area, target: Area): boolean {
        return source.borders
                .filter((seaArea) => {
                    return !seaArea.isLandArea && seaArea.units.length > 0 && seaArea.controllingHouse === source.controllingHouse;
                })
                .filter((areaWithShip) => {
                    let foundConnection = this.connectedUsingShipTransport(areaWithShip, target);
                    return foundConnection || areaWithShip.borders.filter((areaReachableByShip) => {
                            return areaReachableByShip.key === target.key;
                        }).length > 0;
                }).length > 0;
    }

    public static getAllAreasAllowedToMarchTo(sourceArea: Area): Array<Area> {

        if (sourceArea.units.length === 0) {
            return new Array<Area>();
        }
        return GameRules.gameState.areas
            .filter((area) => {
                return this.isAllowedToMove(sourceArea, area, sourceArea.units[0]);
            });
    }


    public static establishControl(area: Area) {
        let currentPlayer = GameRules.gameState.currentPlayer;
        currentPlayer.powerToken--;

        GameRules.gameState.areas.filter((gameStateArea) => {
            return area.key === gameStateArea.key;
        }).map((area) => {
            area.controllingHouse = currentPlayer.house;
        });
    }

    public static resolveFight(combatResult: CombatResult) {
        combatResult.attackersCard.played = true;
        combatResult.defendersCard.played = true;
        CombatCalculator.resolveHouseCard(combatResult, CardExecutionPoint.afterFight);
        let loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        let winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        if (combatResult.attackingArea.controllingHouse === winningArea.controllingHouse) {
            loosingArea.controllingHouse = winningArea.controllingHouse;
            loosingArea.orderToken = null;
            loosingArea.units = [];
            MovementRules.moveUnits(winningArea.key, loosingArea.key, winningArea.units, true);
        }
        else {
            loosingArea.units = [];
            loosingArea.orderToken = null;
            loosingArea.controllingHouse = null;
        }
    }

    private static enoughSupplyForArmySize(source: Area, target: Area) {
        let atleastOneUnitCanMove = target.units.length + 1 <= SupplyRules.allowedMaxSizeBasedOnSupply(source.controllingHouse);
        return target.controllingHouse === null || target.controllingHouse !== source.controllingHouse || (target.controllingHouse === source.controllingHouse && atleastOneUnitCanMove);
    }
}