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
        if (index === -1) {
            throw Error("Area is not eligible for recruiting");
        }
        areasAllowedToRecruit.splice(index, 1);
        unitTypes.forEach((unittype) => {
            area.units.push(new Unit(unittype, area.controllingHouse));
        });
    }

    public static getAreasAllowedToRecruit(house: House): Array<Area> {
        return GameRules.gameState.areasAllowedToRecruit.filter((area) => {
            if(area.controllingHouse !== house){
                return false;
            }
            let maxArmySize = SupplyRules.allowedMaxSizeBasedOnSupply(area.controllingHouse);
            return area.units.length < maxArmySize;
        });
    }

    public static setAreasAllowedToRecruit() {
        GameRules.gameState.areasAllowedToRecruit =  GameRules.gameState.areas.filter((area) => {
            return area.controllingHouse !== null
                && area.hasCastleOrStronghold()
                && SupplyRules.allowedMaxSizeBasedOnSupply(area.controllingHouse) > area.units.length;
        });
    }
}