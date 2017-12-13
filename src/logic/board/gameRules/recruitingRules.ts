import {Area} from '../area';
import SupplyRules from './supplyRules';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {GameStoreState} from '../gameState/reducer';
import {AreaKey} from '../areaKey';

export default class RecruitingRules {

    public static calculateAreasAllowedToRecruit(state: GameStoreState) {
        return state.areas.values().filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state) > area.units.length;
        }).map(area => area.key);
    }

    // This method is used by others than the reducer. It should be moved to another class
    public static getAreasAllowedToRecruit(state: GameStoreState): Array<Area> {

        return state.areasAllowedToRecruit.filter((areaKey: AreaKey) => {
            const area = state.areas.get(areaKey);
            if (area.controllingHouse !== state.currentHouse) {
                return false;
            }

            let maxArmySize = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);
            return area.units.length < maxArmySize;
        }).map(areaKey => state.areas.get(areaKey));
    }

    public static addUnitsToArea(area: Area, unitTypes: UnitType[]): Area {
        const newArea: Area = area.copy();
        unitTypes.forEach((unittype) => {
            newArea.units.push(new Unit(unittype, area.controllingHouse));
        });
        return newArea;
    }

    public static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[] {
        let newAreasAllowedToRecruit = areasAllowedToRecruit.slice();
        let index = newAreasAllowedToRecruit.indexOf(areaKey);
        newAreasAllowedToRecruit.splice(index, 1);
        return newAreasAllowedToRecruit;
    }
}