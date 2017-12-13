import {House} from '../house';
import {TSMap} from 'typescript-map';
import {Area} from '../area';
import {GameStoreState} from '../gameState/reducer';
export default class SupplyRules {

    private static SUPPLY_VS_ARMY_SIZE = [[2, 2], [3, 2], [3, 2, 2], [3, 2, 2, 2], [3, 3, 2, 2], [4, 3, 2, 2], [4, 3, 2, 2, 2]];

    public static calculateAllowedMaxSizeBasedOnSupply(state: GameStoreState): number {
        let areas: Area[] = state.areas.values();
        let currentHouse: House = state.currentHouse;
        let supplyScore = state.currentlyAllowedSupply.get(currentHouse);
        let armiesForHouse: Array<number> = this.calculateArmiesBySizeForHouse(areas, currentHouse);
        let maxSize = 0;
        let index = 0;
        let allowedArmies = this.SUPPLY_VS_ARMY_SIZE[supplyScore];

        for (let largestPossibleSize of allowedArmies) {
            let armySize: number = armiesForHouse[index];
            if (armySize === undefined || armySize < largestPossibleSize) {
                return largestPossibleSize;
            }
            index++;
        }
        return maxSize;
    }

    public static calculateArmiesBySizeForHouse(areas: Area[], house: House): Array<number> {
        return areas.filter((area) => {
            // an army of one unit does not count as an army
            return area.controllingHouse === house && area.units.length > 1;
        }).map((area) => {
            return area.units.length;
        }).sort((a, b) => {
            return b - a;
        });
    }

    public static calculateNumberOfSupply(house: House, areas: Area[]): number {
        return areas.filter((area: Area) => {
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

    public static updateSupply(state: GameStoreState): TSMap<House, number> {
        let updatedSupply = new TSMap<House, number>();
        state.players.forEach((player) => {
            updatedSupply.set(player.house, this.calculateNumberOfSupply(player.house, state.areas.values()));
        });
        return updatedSupply;
    }

    public static enoughSupplyForArmySize(state: GameStoreState, source: Area, target: Area): boolean {
        let atleastOneUnitCanMove = target.units.length + 1 <= SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);
        return target.controllingHouse === null || target.controllingHouse !== source.controllingHouse || (target.controllingHouse === source.controllingHouse && atleastOneUnitCanMove);
    }
}