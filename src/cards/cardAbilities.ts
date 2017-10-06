import CombatResult from '../ui/combat/combatResult';
import Card from './card';
import GameState from '../logic/gameStati';
import {House} from '../logic/house';

export default class CardAbilities {
    public static getAllCardsBack(currentCard: Card, combatResult: CombatResult): CombatResult {
        GameState.getInstance().players
            .filter((player) => {
                player.house === currentCard.house
            })
            .map((player) => {
                player.cards.map((card) => {
                    card.played = false;
                });
            });
        return combatResult;
    }

    public static defineEnemiesRetreat(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('defineEnemiesRetreat was called');
        return combatResult;
    }

    public static doubleDefenseToken(currentCard: Card, combatResult: CombatResult): CombatResult {
        let defenderHouse = combatResult.defendingArea.controllingHouse;
        let defenderCardHouse = combatResult.defendersCard.house
        if (defenderCardHouse === defenderHouse && combatResult.defendingArea.orderToken.isDefendToken()) {
            combatResult.defenderStrength += combatResult.defendingArea.orderToken.value;

        }
        return combatResult;
    }

    public static noLossesDuringFight(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('noLossesDuringFight was called');
        return combatResult;
    }

    public static fightForStannisBaratheon(currentCard: Card, combatResult: CombatResult): CombatResult {
        GameState.getInstance().players
            .filter((player) => {
                player.house === currentCard.house
            })
            .map((player) => {
                player.cards.filter((card) => {
                    card.id === 12;
                });
            });
        return combatResult;
    }

    public static navelPowerThroughSupport(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('navelPowerThroughSupport was called');
        return combatResult;
    }

    public static dropAdditionalEnemiesCard(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('dropAdditionalEnemiesCard was called');
        return combatResult;
    }

    public static demandForPower(currentCard: Card, combatResult: CombatResult): CombatResult {
        let opponent: House = combatResult.attackersCard.house === currentCard.house ? combatResult.defendersCard.house : combatResult.attackersCard.house;

        if (GameState.getInstance().ironThroneSuccession.indexOf(currentCard.house) > GameState.getInstance().ironThroneSuccession.indexOf(opponent)) {

        }
        if (currentCard.house === combatResult.attackersCard.house) {
            combatResult.attackerStrength += 1;
        }
        else {
            combatResult.defenderStrength += 1;
        }
        return combatResult;
    }

    public static accolade(currentCard: Card, combatResult: CombatResult): CombatResult {
        return combatResult;
    }

    public static removeEnemiesOrderTokenForSuccess(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('removeEnemiesOrderTokenForSuccess was called');
        return combatResult;
    }

    public static denyEnemiesHouseCard(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('denyEnemiesHouseCard was called');
        return combatResult;
    }

    public static powerForSuccess(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('powerForSuccess was called');
        return combatResult;
    }

    public static strongAttackingShips(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('strongAttackingShips was called');
        return combatResult;
    }

    public static greatDefender(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('greatDefender was called');
        return combatResult;
    }

    public static fearfulnessEnemy(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('fearfulnessEnemy was called');
        return combatResult;
    }

    public static lonlyFighter(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('lonlyFighter was called');
        return combatResult;
    }

    public static replaceHousecard(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('replaceHousecard was called');
        return combatResult;
    }

    public static agonyOfFootman(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('agonyOfFootman was called');
        return combatResult;
    }

    public static longCombat(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('longCombat was called');
        return combatResult;
    }

    public static beStrong(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('beStrong was called');
        if (currentCard.house === combatResult.attackersCard.house) {
            combatResult.attackerStrength += 1;
        }
        else {
            combatResult.defenderStrength += 1;
        }
        return combatResult;
    }

    public static thwartInvasion(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('thwartInvasion was called');
        return combatResult;
    }

    public static lostInfluence(currentCard: Card, combatResult: CombatResult): CombatResult {
        console.log('lostInfluence was called');
        return combatResult;
    }

}