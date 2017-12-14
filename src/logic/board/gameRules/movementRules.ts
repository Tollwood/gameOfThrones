import {Area} from '../area';
import SupplyRules from './supplyRules';
import CombatResult from '../../march/combatResult';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {moveUnits} from '../gameState/actions';
export default class MovementRules {

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