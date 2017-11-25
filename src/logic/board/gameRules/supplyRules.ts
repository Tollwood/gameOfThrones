import {House} from '../house';
import {TSMap} from 'typescript-map';
import {Area} from '../area';
import GameRules from './gameRules';
export default class SupplyRules {

    private static SUPPLY_VS_ARMY_SIZE = [[2, 2], [3, 2], [3, 2, 2], [3, 2, 2, 2], [3, 3, 2, 2], [4, 3, 2, 2], [4, 3, 2, 2, 2]];

    public static allowedMaxSizeBasedOnSupply(house: House): number {
        let armiesForHouse: Array<number> = this.getArmiesBySizeForHouse(house);
        let numOfSupply = GameRules.gameState.currentlyAllowedSupply.get(house);
        let maxSize = 0;
        let index = 0;
        let allowedArmies = this.SUPPLY_VS_ARMY_SIZE[numOfSupply];

        for (let largestPossibleSize of allowedArmies) {
            let armySize: number = armiesForHouse[index];
            if (armySize === undefined || armySize < largestPossibleSize) {
                return largestPossibleSize;
            }
            index++;
        }
        return maxSize;
    }

    public static getArmiesBySizeForHouse(house: House): Array<number> {
        return GameRules.gameState.areas.filter((area) => {
            // an army of one unit does not count as an army
            return area.controllingHouse === house && area.units.length > 1;
        }).map((area) => {
            return area.units.length;
        }).sort((a, b) => {
            return b - a;
        });
    }

    public static getNumberOfSupply(house: House): number {
        return GameRules.gameState.areas.filter((area: Area) => {
            return area.controllingHouse === house && area.supply > 0;
        }).map((area) => {
            return area.supply;
        }).reduce(
            (accumulator,
             currentValue) => {
                return accumulator + currentValue;
            }, 0
        );
    }

    public static updateSupply() {
        let updatedSupply = new TSMap<House, number>();
        GameRules.gameState.players.forEach((player) => {
            updatedSupply.set(player.house, this.getNumberOfSupply(player.house));
        });
        GameRules.gameState.currentlyAllowedSupply = updatedSupply;
    }

    public static enoughSupplyForArmySize(source: Area, target: Area) {
        let atleastOneUnitCanMove = target.units.length + 1 <= SupplyRules.allowedMaxSizeBasedOnSupply(source.controllingHouse);
        return target.controllingHouse === null || target.controllingHouse !== source.controllingHouse || (target.controllingHouse === source.controllingHouse && atleastOneUnitCanMove);
    }
}