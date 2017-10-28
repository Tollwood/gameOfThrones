import {House} from '../house';
import {Area} from '../area';
import SupplyRules from './supplyRules';
import {UnitType} from '../../units/unitType';
import Unit from '../../units/units';
import GameRules from './gameRules';

export default class RecruitingRules {

    public static recruit(area: Area, unitTypes: UnitType[] = []) {
        let areasAllowedToRecruit = GameRules.gameState.areasAllowedToRecruit;
        let index = areasAllowedToRecruit.indexOf(area);
        areasAllowedToRecruit.splice(index, 1);
        this.setAreasAllowedToRecruit(areasAllowedToRecruit);
        unitTypes.forEach((unittype) => {
            area.units.push(new Unit(unittype, area.controllingHouse));
        });
    }

    public static getAreasAllowedToRecruit(house?: House): Array<Area> {
        return GameRules.gameState.areasAllowedToRecruit.filter((area) => {
            let maxArmySize = SupplyRules.allowedMaxSizeBasedOnSupply(area.controllingHouse);
            return ( house === undefined || area.controllingHouse === house) && area.units.length < maxArmySize;
        });
    }

    public static setAreasAllowedToRecruit(areasForRecruiting: Array<Area> = GameRules.gameState.areas) {

        GameRules.gameState.areasAllowedToRecruit = areasForRecruiting.filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.allowedMaxSizeBasedOnSupply(area.controllingHouse) > area.units.length;
        });
    }
}