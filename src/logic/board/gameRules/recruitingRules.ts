import {Area} from '../area';
import SupplyRules from './supplyRules';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {GameStoreState} from '../gameState/reducer';
import {AreaKey} from '../areaKey';
import GameRules from './gameRules';
import {TSMap} from 'typescript-map';

export default class RecruitingRules {

    public static setAreasAllowedToRecruit(state: GameStoreState) {
        return state.areas.values().filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.allowedMaxSizeBasedOnSupply(state) > area.units.length;
        }).map(area => area.key);
    }

    // This method is used by others than the reducer. It should be moved to another class
    public static getAreasAllowedToRecruit(state: GameStoreState): Array<Area> {
        const currentPlayer = state.currentPlayer;

        return state.areasAllowedToRecruit.filter((areaKey: AreaKey) => {
            const area = GameRules.getAreaByKey(areaKey);
            if (area.controllingHouse !== currentPlayer.house) {
                return false;
            }

            let maxArmySize = SupplyRules.allowedMaxSizeBasedOnSupply(state);
            return area.units.length < maxArmySize;
        }).map(areaKey => GameRules.getAreaByKey(areaKey));
    }

    public static addUnitsToArea(areas: TSMap<AreaKey, Area>, area: Area, unitTypes: UnitType[]) {
        unitTypes.forEach((unittype) => {
            area.units.push(new Unit(unittype, area.controllingHouse));
        });
        return areas;
    }

    public static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[] {
        let newAreasAllowedToRecruit = areasAllowedToRecruit.slice();
        let index = newAreasAllowedToRecruit.indexOf(areaKey);
        newAreasAllowedToRecruit.splice(index, 1);
        return newAreasAllowedToRecruit;
    }
}