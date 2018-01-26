import {Area} from '../board/area';
import CombatResult from './combatResult';
import {OrderToken} from '../orderToken/orderToken';
import Unit from '../units/units';
import {UnitType} from '../units/unitType';
import {OrderTokenType} from '../orderToken/orderTokenType';

export default class CombatCalculator {

    public static calculateCombat(sourceArea: Area, targetArea: Area): CombatResult {

        let attackerStrength = this.calculateStrengthOfArmy(sourceArea.units);
        attackerStrength += this.calculateOrderTokenStrengh(sourceArea.orderToken, true);
        let defenderStrength = this.calculateStrengthOfArmy(targetArea.units);
        defenderStrength += this.calculateOrderTokenStrengh(targetArea.orderToken, false);
        let combatResult = new CombatResult(sourceArea, targetArea, attackerStrength, defenderStrength);
        return combatResult;
    }

    private static calculateOrderTokenStrengh(orderToken: OrderToken, attacking: boolean) {
        let strength = 0;
        if (attacking) {
            switch (orderToken.getType()) {
                case OrderTokenType.march_minusOne:
                    strength -= 1;
                    break;
                case OrderTokenType.march_special:
                    strength += 1;
                    break;
                default:
                    strength += 0;
            }
        } else {
            if (orderToken === null) {
                return strength;
            }
            switch (orderToken.getType()) {
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_0:
                    strength += 1;
                    break;
                case OrderTokenType.defend_special:
                    strength += 2;
                    break;
                default:
                    strength += 0;
            }
        }

        return strength;
    }

    private static calculateStrengthOfArmy(units: Array<Unit>): number {
        let strength = 0;
        units.forEach((unit) => {
            switch (unit.getType()) {
                case UnitType.Footman:
                    strength += 1;
                    break;
                case UnitType.Horse:
                    strength += 2;
                    break;
                case UnitType.Siege:
                    strength += 4;
                    break;
                case UnitType.Ship:
                    strength += 1;
                    break;
            }
        });
        return strength;
    }
}