import {Area} from '../area';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
import Unit from '../../units/units';
import {UnitType} from '../../units/unitType';
import StateSelectorService from '../gameRules/stateSelectorService';
import AreaBuilder from '../../../../test/areaBuilder';

export default class AreaStateModificationService {

    public static recruitUnits(areas: Area[], areaKey: AreaKey, unitTypes: UnitType[]): Map<AreaKey, Area> {
        const newAreaMap = new Map<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (newArea.key === areaKey) {
                newArea.orderToken = null;
                unitTypes.forEach((unittype) => {
                    newArea.units.push(new Unit(unittype, newArea.controllingHouse));
                });
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;


    }

    public static removeAllRemainingTokens(areas: Area[]): Map<AreaKey, Area> {
        const newAreasMap = new Map<AreaKey, Area>();
        areas.forEach(area => {
            const copyOfArea = area.copy();
            copyOfArea.orderToken = null;
            newAreasMap.set(copyOfArea.key, copyOfArea);

        });
        return newAreasMap;
    }

    public static addOrderToken(areas: Area[], ordertoken: OrderToken, areaKey: AreaKey): Map<AreaKey, Area> {
        const newAreaMap = new Map<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (newArea.key === areaKey) {
                newArea.orderToken = ordertoken;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }

    public static removeOrderTokens(areas: Area[], areaKeys: AreaKey[]): Map<AreaKey, Area> {
        const newAreaMap = new Map<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (areaKeys.lastIndexOf(newArea.key) > -1) {
                newArea.orderToken = null;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }

    public static removeOrderToken(areas: Area[], areaKey: AreaKey): Map<AreaKey, Area> {
        return this.addOrderToken(areas, null, areaKey);
    }

    public static moveUnits(areas: Area[], source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true, establishControl: boolean = false): Map<AreaKey, Area> {
        const newAreasMap = new Map<AreaKey, Area>();
        let foundTarget = false;
        areas.forEach((area) => {
            let updatedArea: Area;
            if (area.key === source) {
                updatedArea = this.updateSourceArea(area, movingUnits, completeOrder, establishControl);
                updatedArea ? newAreasMap.set(updatedArea.key, updatedArea) : null;
            } else if (area.key === target) {
                foundTarget = true;
                updatedArea = this.updateTargetArea(area, movingUnits);
            }
            else {
                updatedArea = area.copy();
            }
            updatedArea ? newAreasMap.set(updatedArea.key, updatedArea) : null;

        });
        if (!foundTarget) {
            const newArea = new AreaBuilder(target)
                .withHouse(movingUnits[0].getHouse())
                .withUnits(movingUnits.map(units => units.getType()))
                .build();
            newAreasMap.set(newArea.key, newArea);
        }
        return newAreasMap;
    }

    private static updateSourceArea(oldArea: Area, movingUnits: Unit[], completeOrder: boolean, establishControl: boolean): Area {
        if (oldArea.units.length === movingUnits.length && !establishControl) {
            return null;
        }
        const sourceArea = oldArea.copy();
        let remainingUnits = sourceArea.units.filter((sourceUnit) => {
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
            sourceArea.controllingHouse = oldArea.controllingHouse;
        }
        return sourceArea;
    }

    private static updateTargetArea(oldArea: Area, movingUnits: Unit[]): Area {
        const targetArea = oldArea.copy();
        targetArea.units = targetArea.units.concat(movingUnits);
        if (movingUnits.length > 0) {
            targetArea.controllingHouse = movingUnits[0].getHouse();
        }
        return targetArea;

    }

    public static updateAfterFight(areas: Area[], attackingAreaKey: AreaKey, winningAreaKey: AreaKey, loosingAreaKey: AreaKey, units: Array<Unit>) {

        const newAreasMap = new Map<AreaKey, Area>();
        areas.forEach((area) => {
            const newArea = area.copy();
            if (attackingAreaKey === winningAreaKey) {
                const winningArea: Area = StateSelectorService.getAreaByKey(winningAreaKey);
                if (newArea.key === winningAreaKey) {
                    newArea.units = [];
                    newArea.orderToken = null;
                    newArea.controllingHouse = winningArea.controllingHouse;
                } else if (newArea.key === loosingAreaKey) {
                    newArea.units = units;
                    newArea.orderToken = null;
                    newArea.controllingHouse = winningArea.controllingHouse;
                }

            } else if (attackingAreaKey === loosingAreaKey) {
                if (newArea.key === attackingAreaKey) {
                    newArea.units = [];
                    newArea.orderToken = null;
                    newArea.controllingHouse = null;
                }
            }
            newAreasMap.set(newArea.key, newArea);
        });
        return newAreasMap;
    }
}
