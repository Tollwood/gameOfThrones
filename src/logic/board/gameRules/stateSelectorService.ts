import {Area} from '../area';
import {gameStore} from '../gameState/reducer';
import {AreaKey} from '../areaKey';
import Player from '../player';
import {House} from '../house';
import {GameStoreState} from '../gameState/gameStoreState';
import {AreaStatsService} from '../AreaStatsService';

export default class StateSelectorService {

    public static getFirstFromIronThroneSuccession(state: GameStoreState): House {
        return state.ironThroneSuccession[0];
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        const area = gameStore.getState().areas.get(areaKey);
        return area ? area : null;
    }

    public static getPlayerByHouse(house: House): Player {
        return gameStore.getState().players.filter(player => player.house === house)[0];
    }

    // move related

    public static getAllAreasAllowedToMarchTo(state: GameStoreState, sourceArea: Area): AreaKey[] {
        let validAreas: AreaKey[] = [];
        if (sourceArea.units.length === 0) {
            return validAreas;
        }
        const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
        return validAreas.concat(this.getValidAreas(state, sourceArea, sourceAreaStats.borders));
    }

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

    public static enoughSupplyForArmySize(state: GameStoreState, source: Area, target: Area): boolean {
        const targetArmySize = target === undefined ? 0 : target.units.length;
        let atleastOneUnitCanMove = targetArmySize + 1 <= this.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);
        return target === undefined || target.controllingHouse !== source.controllingHouse || (target.controllingHouse === source.controllingHouse && atleastOneUnitCanMove);
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

    private static getValidAreas(state: GameStoreState, sourceArea: Area, areasToCheck: AreaKey[]) {
        let validAreas: AreaKey[] = [];
        areasToCheck
            .forEach((areaKey) => {
                if (this.isAllowedToMove(state, sourceArea, areaKey)) {
                    validAreas.push(areaKey);
                }
                const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
                const areaStats = AreaStatsService.getInstance().areaStats.get(areaKey);
                const area = state.areas.get(areaKey);
                if (sourceAreaStats.isLandArea && !areaStats.isLandArea && (area !== undefined && (area.units.length > 0 && area.controllingHouse === sourceArea.controllingHouse))) {
                    validAreas = validAreas.concat(this.getValidAreas(state, sourceArea, areaStats.borders));
                }
            });

        return validAreas;
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

    private static isAllowedToMove(state: GameStoreState, source: Area, targetKey: AreaKey): boolean {
        const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(source.key);
        const targetAreaStats = AreaStatsService.getInstance().areaStats.get(targetKey);
        const landToLandMove = sourceAreaStats.isLandArea && targetAreaStats.isLandArea;
        const seaToSeaMove = !sourceAreaStats.isLandArea && !targetAreaStats.isLandArea;
        const enoughSupplyForArmySize = this.enoughSupplyForArmySize(state, source, state.areas.get(targetKey));

        return (landToLandMove || seaToSeaMove) && enoughSupplyForArmySize;
    }
}