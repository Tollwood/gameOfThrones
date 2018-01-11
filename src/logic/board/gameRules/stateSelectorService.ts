import {Area} from '../area';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {AreaKey} from '../areaKey';
import Player from '../player';
import {House} from '../house';
export default class StateSelectorService {

    public static getFirstFromIronThroneSuccession(state: GameStoreState): House {
        return state.ironThroneSuccession[0];
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        return gameStore.getState().areas.get(areaKey);
    }

    public static getPlayerByHouse(house: House): Player {
        return gameStore.getState().players.filter(player => player.house === house)[0];
    }

    // move related

    public static getAllAreasAllowedToMarchTo(state: GameStoreState, sourceArea: Area): Array<Area> {
        let validAreas = [];
        if (sourceArea.units.length === 0) {
            return validAreas;
        }
        return validAreas.concat(this.getValidAreas(state, sourceArea, sourceArea.borders));
    }

    private static getValidAreas(state: GameStoreState, sourceArea: Area, areasToCheck: Area[]) {
        let validAreas = [];
        areasToCheck
            .forEach((area) => {
                if (this.isAllowedToMove(state, sourceArea, area)) {
                    validAreas.push(area);
                }
                if (sourceArea.isLandArea && !area.isLandArea && area.units.length > 0 && area.controllingHouse === sourceArea.controllingHouse) {
                    validAreas = validAreas.concat(this.getValidAreas(state, sourceArea, area.borders));
                }
            });

        return validAreas;
    }

    private static isAllowedToMove(state: GameStoreState, source: Area, target: Area): boolean {
        const landToLandMove = source.isLandArea && target.isLandArea;
        const seaToSeaMove = !source.isLandArea && !target.isLandArea;
        const enoughSupplyForArmySize = this.enoughSupplyForArmySize(state, source, target);

        return (landToLandMove || seaToSeaMove) && enoughSupplyForArmySize;
    }


    // recruiting related

    public static getAreasAllowedToRecruit(state: GameStoreState, house: House): Array<Area> {
        return state.areasAllowedToRecruit.filter((areaKey: AreaKey) => {
            const area = state.areas.get(areaKey);
            if (area.controllingHouse !== house) {
                return false;
            }

            let maxArmySize = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, house);
            return area.units.length < maxArmySize;
        }).map(areaKey => state.areas.get(areaKey));
    }


    // Supply related

    private static SUPPLY_VS_ARMY_SIZE = [[2, 2], [3, 2], [3, 2, 2], [3, 2, 2, 2], [3, 3, 2, 2], [4, 3, 2, 2], [4, 3, 2, 2, 2]];

    public static calculateAllowedMaxSizeBasedOnSupply(state: GameStoreState, house: House): number {
        let areas: Area[] = state.areas.values();
        let supplyScore = state.currentlyAllowedSupply.get(house);
        let armiesForHouse: Array<number> = this.calculateArmiesBySizeForHouse(areas, house);
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

    public static enoughSupplyForArmySize(state: GameStoreState, source: Area, target: Area): boolean {
        let atleastOneUnitCanMove = target.units.length + 1 <= this.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);
        return target.controllingHouse === null || target.controllingHouse !== source.controllingHouse || (target.controllingHouse === source.controllingHouse && atleastOneUnitCanMove);
    }
}