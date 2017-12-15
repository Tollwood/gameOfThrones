import {Area} from '../area';
import {TSMap} from 'typescript-map';
import {AreaKey} from '../areaKey';
import {OrderToken} from '../../orderToken/orderToken';
import GameRules from '../gameRules/gameRules';
import {House} from '../house';
import Unit from '../../units/units';
import {UnitType} from '../../units/unitType';
export default class AreaStateModificationService {

    public static recruitUnits(areas: Area[], areaKey: AreaKey, unitTypes: UnitType[]): TSMap<AreaKey, Area> {
        const newAreaMap = new TSMap<AreaKey, Area>();
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

    public static removeAllRemainingTokens(areas: Area[]): TSMap<AreaKey, Area> {
        const newAreasMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const copyOfArea = area.copy();
            copyOfArea.orderToken = null;
            newAreasMap.set(copyOfArea.key, copyOfArea);

        });
        return newAreasMap;
    }

    public static addOrderToken(areas: Area[], ordertoken: OrderToken, areaKey: AreaKey): TSMap<AreaKey, Area> {
        const newAreaMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (newArea.key === areaKey) {
                newArea.orderToken = ordertoken;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }


    public static removeOrderTokens(areas: Area[], areaKeys: AreaKey[]): TSMap<AreaKey, Area> {
        const newAreaMap = new TSMap<AreaKey, Area>();
        areas.forEach(area => {
            const newArea = area.copy();
            if (areaKeys.lastIndexOf(newArea.key) > -1) {
                newArea.orderToken = null;
            }
            newAreaMap.set(newArea.key, newArea);
        });
        return newAreaMap;
    }

    public static removeOrderToken(areas: Area[], areaKey: AreaKey): TSMap<AreaKey, Area> {
        return this.addOrderToken(areas, null, areaKey);
    }

    public static moveUnits(areas: Area[], source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true, establishControl: boolean = false): TSMap<AreaKey, Area> {
        const newAreasMap = new TSMap<AreaKey, Area>();
        areas.forEach((area) => {
            const newArea = area.copy();
            if (newArea.key === source) {
                this.updateSourceArea(newArea, movingUnits, completeOrder, establishControl, newArea.controllingHouse);
            }
            if (newArea.key === target) {
                this.updateTargetArea(newArea, movingUnits);
            }
            newAreasMap.set(newArea.key, newArea);
        });
        return newAreasMap;
    }

    private static updateSourceArea(sourceArea: Area, movingUnits: Unit[], completeOrder: boolean, establishControl: boolean, controllingHouse: House) {
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
            let player = GameRules.getPlayerByHouse(controllingHouse);
            sourceArea.controllingHouse = player.house;
        }
    }

    private static updateTargetArea(targetArea: Area, movingUnits: Unit[]) {
        targetArea.units = targetArea.units.concat(movingUnits);
        if (movingUnits.length > 0) {
            targetArea.controllingHouse = movingUnits[0].getHouse();
        }

    }
}