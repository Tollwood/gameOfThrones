import {AreaKey} from '../areaKey';
import StateSelectorService from '../gameRules/stateSelectorService';
import {GameStoreState} from './gameStoreState';

export default class RecruitingStateModificationService {

    public static calculateAreasAllowedToRecruit(state: GameStoreState): AreaKey[] {
        return state.areas.values().filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse) > area.units.length;
        }).map(area => area.key);
    }


    public static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[] {
        let newAreasAllowedToRecruit = areasAllowedToRecruit.slice();
        let index = newAreasAllowedToRecruit.indexOf(areaKey);
        newAreasAllowedToRecruit.splice(index, 1);
        return newAreasAllowedToRecruit;
    }
}