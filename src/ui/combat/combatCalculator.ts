import {Area} from '../../logic/area';
import CombatResult from './combatResult';
import {OrderTokenType} from '../../logic/orderToken';
import {Unit, UnitType} from '../../logic/units';
import Card from '../../cards/card';
import {House} from '../../logic/house';
export default class CombatCalculator {

    public static calculateCombat(sourceArea: Area, targetArea: Area): CombatResult {

        let attackerStrength = this.calculateStrengthOfArmy(sourceArea.units);
        attackerStrength += this.calculateOrderTokenStrengh(sourceArea.orderToken.getType(), true);
        let defenderStrength = this.calculateStrengthOfArmy(targetArea.units);
        defenderStrength += this.calculateOrderTokenStrengh(targetArea.orderToken.getType(), false);
        let winner = attackerStrength > defenderStrength ? sourceArea.controllingHouse : targetArea.controllingHouse;
        let looser = attackerStrength > defenderStrength ? targetArea.controllingHouse : sourceArea.controllingHouse;
        let lostUnits = sourceArea.controllingHouse === winner ? targetArea.units : sourceArea.units;
        // remove fake cards - replace with real user selection
        return new CombatResult(sourceArea, targetArea, winner, looser, lostUnits, new Card('SomeOne', null, 0, 0, 0, 'get all cards back', 'getAllCardsBack', House.stark), new Card('SomeOne', null, 0, 0, 0, 'get all cards back', 'getAllCardsBack', House.stark));
    }

    private static calculateOrderTokenStrengh(orderTokenType: OrderTokenType, attacking: boolean) {
        let strength = 0;
        if (attacking) {
            switch (orderTokenType) {
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
            switch (orderTokenType) {
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