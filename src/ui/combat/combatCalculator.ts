import {Area} from '../../logic/area';
import CombatResult from './combatResult';
import {OrderTokenType} from '../../logic/orderToken';
import {Unit, UnitType} from '../../logic/units';
import HouseCard from '../../cards/logic/houseCard';
import {CardExecutionPoint} from '../../cards/logic/cardExecutionPoint';
import CardAbilities from '../../cards/logic/cardAbilities';
import GameState from '../../logic/gameStati';
export default class CombatCalculator {

    public static calculateCombat(sourceArea: Area, targetArea: Area, attackersCard: HouseCard, defendersCard: HouseCard): CombatResult {

        let attackerStrength = this.calculateStrengthOfArmy(sourceArea.units);
        attackerStrength += this.calculateOrderTokenStrengh(sourceArea.orderToken.getType(), true);
        let defenderStrength = this.calculateStrengthOfArmy(targetArea.units);
        defenderStrength += this.calculateOrderTokenStrengh(targetArea.orderToken.getType(), false);
        let combatResult = new CombatResult(sourceArea, targetArea, attackersCard, defendersCard, attackerStrength, defenderStrength, attackersCard.sword, attackersCard.fortification, defendersCard.sword, defendersCard.fortification);
        this.resolveHouseCard(combatResult, CardExecutionPoint.beforeFight);
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

    public static resolveHouseCard(combatResult: CombatResult, cardExecutionPoint: CardExecutionPoint) {
        let cardsToResolve = new Array<HouseCard>();
        if (combatResult.attackersCard.cardExecutionPoint === cardExecutionPoint) {
            cardsToResolve.push(combatResult.attackersCard);
        }

        if (combatResult.defendersCard.cardExecutionPoint === cardExecutionPoint) {
            cardsToResolve.push(combatResult.defendersCard);
        }
        cardsToResolve.sort((a, b) => {
            return GameState.getInstance().ironThroneSuccession.indexOf(a.house) - GameState.getInstance().ironThroneSuccession.indexOf(b.house);
        });

        cardsToResolve.forEach((card) => {
            CardAbilities[card.abilityFn](card, combatResult);
        });
    }
}