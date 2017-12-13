import {Area} from '../area';
import Unit from '../../units/units';
import SupplyRules from './supplyRules';
import CombatResult from '../../march/combatResult';
import GameRules from './gameRules';
import {AreaKey} from '../areaKey';
import {House} from '../house';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {moveUnits} from '../gameState/actions';
import {TSMap} from 'typescript-map';
export default class MovementRules {

    public static moveUnits(areas: Area[], source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true, establishControl: boolean = false): TSMap<AreaKey, Area> {
        const newAreasMap = new TSMap<AreaKey, Area>();
        areas.forEach((area) => {
            const newArea = area.copy();
            if (area.key === source) {
                this.updateSourceArea(newArea, movingUnits, completeOrder, establishControl, newArea.controllingHouse);
            }
            if (area.key === target) {
                this.updateTargetArea(newArea, movingUnits);
            }
            newAreasMap.set(newArea.key, newArea);
        });
        return newAreasMap;
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

    private static establishControl(area: Area, house: House) {
        let player = GameRules.getPlayerByHouse(house);
        if (player.powerToken === 0) {
            console.log('not enough power Tokens to establish control in: ' + area.key);
            return;
        }
        // TODO immutable -> do not change state, return new object instead
        player.powerToken--;
        area.controllingHouse = player.house;
    }

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

    private static updateSourceArea(sourceArea: Area, movingUnits: Unit[], completeOrder: boolean, establishControl: boolean, controllingHouse: House) {
        let remainingUnits = sourceArea.units.filter((sourceUnit) => {
            return movingUnits.indexOf(sourceUnit) === -1;
        });
        sourceArea.units = remainingUnits;
        if (sourceArea.units.length === 0) {
            sourceArea.controllingHouse = null;
        }
        if (completeOrder) {
            sourceArea.orderToken = null;
        }
        if (completeOrder && establishControl) {
            this.establishControl(sourceArea, controllingHouse);
        }
    }

    private static updateTargetArea(targetArea: Area, movingUnits: Unit[]) {
        targetArea.units = targetArea.units.concat(movingUnits);
        if (movingUnits.length > 0) {
            targetArea.controllingHouse = movingUnits[0].getHouse();
        }

    }
}