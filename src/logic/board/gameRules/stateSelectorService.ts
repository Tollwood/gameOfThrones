import {Area} from '../area';
import SupplyRules from './supplyRules';
import CombatResult from '../../march/combatResult';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {moveUnits} from '../gameState/actions';
import {AreaKey} from '../areaKey';
import Player from '../player';
import {House} from '../house';
export default class StateSelectorService {

    public static getFirstFromIronThroneSuccession(state: GameStoreState): House {
        return state.ironThroneSuccession[0];
    }

    // TODO should get State as input parameter
    public static getAreaByKey(areaKey: AreaKey): Area {
        return gameStore.getState().areas.get(areaKey);
    }

    // TODO should get State as input parameter
    public static getPlayerByHouse(house: House): Player {
        return gameStore.getState().players.filter((player) => {
            return player.house === house;
        })[0];
    }

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
        const enoughSupplyForArmySize = SupplyRules.enoughSupplyForArmySize(state, source, target);

        return (landToLandMove || seaToSeaMove) && enoughSupplyForArmySize;
    }

    public static getAreasAllowedToRecruit(state: GameStoreState): Array<Area> {

        return state.areasAllowedToRecruit.filter((areaKey: AreaKey) => {
            const area = state.areas.get(areaKey);
            if (area.controllingHouse !== state.currentHouse) {
                return false;
            }

            let maxArmySize = SupplyRules.calculateAllowedMaxSizeBasedOnSupply(state);
            return area.units.length < maxArmySize;
        }).map(areaKey => state.areas.get(areaKey));
    }

    // TODO Move to an action
    public static resolveFight(combatResult: CombatResult) {
        let loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        let winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        // TODO immutable -> do not change state, return new object instead
        if (combatResult.attackingArea.controllingHouse === winningArea.controllingHouse) {
            loosingArea.controllingHouse = winningArea.controllingHouse;
            loosingArea.orderToken = null;
            loosingArea.units = [];
            gameStore.dispatch(moveUnits(winningArea.key, loosingArea.key, winningArea.units, true, true));
        }
        else {
            loosingArea.units = [];
            loosingArea.orderToken = null;
            loosingArea.controllingHouse = null;
        }
    }
}