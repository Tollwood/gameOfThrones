import SupplyRules from './supplyRules';
import {GameStoreState} from '../gameState/reducer';
import {AreaKey} from '../areaKey';

export default class RecruitingRules {

    public static calculateAreasAllowedToRecruit(state: GameStoreState): AreaKey[] {
        return state.areas.values().filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state) > area.units.length;
        }).map(area => area.key);
    }


    public static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[] {
        let newAreasAllowedToRecruit = areasAllowedToRecruit.slice();
        let index = newAreasAllowedToRecruit.indexOf(areaKey);
        newAreasAllowedToRecruit.splice(index, 1);
        return newAreasAllowedToRecruit;
    }
}