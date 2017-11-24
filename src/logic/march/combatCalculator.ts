import {Area} from '../board/area';
import CombatResult from './combatResult';
import {OrderTokenType} from '../orderToken/orderToken';
import HouseCard from '../cards/houseCard';
import {CardExecutionPoint} from '../cards/cardExecutionPoint';
import CardAbilities from '../cards/cardAbilities';
import Unit from '../units/units';
import {UnitType} from '../units/unitType';
import GameRules from '../board/gameRules/gameRules';
export default class CombatCalculator {

    public static calculateCombat(sourceArea: Area, targetArea: Area): CombatResult {

        let attackerStrength = this.calculateStrengthOfArmy(sourceArea.units);
        attackerStrength += this.calculateOrderTokenStrengh(sourceArea.orderToken.getType(), true);
        let defenderStrength = this.calculateStrengthOfArmy(targetArea.units);
        defenderStrength += this.calculateOrderTokenStrengh(targetArea.orderToken.getType(), false);
        let combatResult = new CombatResult(sourceArea, targetArea, attackerStrength, defenderStrength);
        return combatResult;
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

    public static resolveHouseCard(combatResult: CombatResult, cardExecutionPoint: CardExecutionPoint, attackersCard: HouseCard, defendersCard: HouseCard) {
        let cardsToResolve = new Array<HouseCard>();
        if (attackersCard.cardExecutionPoint === cardExecutionPoint) {
            cardsToResolve.push(attackersCard);
        }

        if (defendersCard.cardExecutionPoint === cardExecutionPoint) {
            cardsToResolve.push(defendersCard);
        }
        cardsToResolve.sort((a, b) => {
            return GameRules.gameState.ironThroneSuccession.indexOf(a.house) - GameRules.gameState.ironThroneSuccession.indexOf(b.house);
        });

        cardsToResolve.forEach((card) => {
            CardAbilities[card.abilityFn](card, combatResult);
        });
    }
}