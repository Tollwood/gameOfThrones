import {Area} from '../area';
import SupplyRules from './supplyRules';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import {GameStoreState} from '../gameState/reducer';
import AiPlayer from '../../ai/aiPlayer';

export default class RecruitingRules {

    public static recruit(state: GameStoreState, area: Area, unitTypes: UnitType[] = []) {
        this.updateAreasAllowedToRecruit(state, area);
        this.addUnitsToArea(area, unitTypes);
    }

    public static setAreasAllowedToRecruit(state: GameStoreState) {
        return state.areas.filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.allowedMaxSizeBasedOnSupply(state) > area.units.length;
        });
    }

    // This method is used by others than the reducer. It should be moved to another class
    public static getAreasAllowedToRecruit(state: GameStoreState): Array<Area> {
        const currentPlayer = state.currentPlayer;
        const isAiPlayer: boolean = currentPlayer instanceof AiPlayer;

        if (isAiPlayer) {
            return [];
        }
        return state.areasAllowedToRecruit.filter((area) => {
            if (area.controllingHouse !== currentPlayer.house) {
                return false;
            }

            let maxArmySize = SupplyRules.allowedMaxSizeBasedOnSupply(state);
            return area.units.length < maxArmySize;
        });
    }

    private static addUnitsToArea(area: Area, unitTypes: UnitType[]) {
        unitTypes.forEach((unittype) => {
            area.units.push(new Unit(unittype, area.controllingHouse));
        });
    }

    private static updateAreasAllowedToRecruit(state: GameStoreState, area: Area) {
        let areasAllowedToRecruit = state.areasAllowedToRecruit;
        let index = areasAllowedToRecruit.indexOf(area);
        if (index === -1) {
            throw Error('Area is not eligible for recruiting');
        }
        areasAllowedToRecruit.splice(index, 1);
    }
}