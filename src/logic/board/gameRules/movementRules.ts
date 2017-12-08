import {Area} from '../area';
import Unit from '../../units/units';
import SupplyRules from './supplyRules';
import CombatResult from '../../march/combatResult';
import GameRules from './gameRules';
import {AreaKey} from '../areaKey';
import {House} from '../house';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {nextPlayer} from '../gameState/actions';
export default class MovementRules {

    public static moveUnits(source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true, establishControl: boolean = false) {

        let sourceArea = GameRules.getAreaByKey(source);
        let targetArea = GameRules.getAreaByKey(target);

        targetArea.units = targetArea.units.concat(movingUnits);
        targetArea.controllingHouse = sourceArea.controllingHouse;

        let remainingUnits = sourceArea.units.filter(function (sourceUnit) {
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
            this.establishControl(sourceArea, targetArea.controllingHouse);
        }
        gameStore.dispatch(nextPlayer());
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
        player.powerToken--;
        area.controllingHouse = player.house;
    }

    public static resolveFight(combatResult: CombatResult) {
        let loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        let winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        if (combatResult.attackingArea.controllingHouse === winningArea.controllingHouse) {
            loosingArea.controllingHouse = winningArea.controllingHouse;
            loosingArea.orderToken = null;
            loosingArea.units = [];
            MovementRules.moveUnits(winningArea.key, loosingArea.key, winningArea.units, true, true);
        }
        else {
            loosingArea.units = [];
            loosingArea.orderToken = null;
            loosingArea.controllingHouse = null;
        }
    }

}