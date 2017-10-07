import CombatResult from '../../ui/combat/combatResult';
import HouseCard from './houseCard';
import GameState from '../../logic/gameStati';
import {House} from '../../logic/house';

export default class CardAbilities {
    public static getAllCardsBack(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        GameState.getInstance().players
            .filter((player) => {
                player.house === currentCard.house;
            })
            .map((player) => {
                player.cards.map((card) => {
                    card.played = false;
                });
            });
        return combatResult;
    }

    public static defineEnemiesRetreat(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('defineEnemiesRetreat was called');
        return combatResult;
    }

    public static doubleDefenseToken(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        let defenderHouse = combatResult.defendingArea.controllingHouse;
        let defenderCardHouse = combatResult.defendersCard.house;
        if (defenderCardHouse === defenderHouse && combatResult.defendingArea.orderToken.isDefendToken()) {
            combatResult.defenderStrength += combatResult.defendingArea.orderToken.value;

        }
        return combatResult;
    }

    public static noLossesDuringFight(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('noLossesDuringFight was called');
        return combatResult;
    }

    public static fightForStannisBaratheon(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        GameState.getInstance().players
            .filter((player) => {
                player.house === currentCard.house;
            })
            .map((player) => {
                player.cards.filter((card) => {
                    card.id === 12;
                });
            });
        return combatResult;
    }

    public static navelPowerThroughSupport(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('navelPowerThroughSupport was called');
        return combatResult;
    }

    public static dropAdditionalEnemiesCard(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('dropAdditionalEnemiesCard was called');
        return combatResult;
    }

    public static demandForPower(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
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

    public static accolade(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        return combatResult;
    }

    public static removeEnemiesOrderTokenForSuccess(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('removeEnemiesOrderTokenForSuccess was called');
        return combatResult;
    }

    public static denyEnemiesHouseCard(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('denyEnemiesHouseCard was called');
        return combatResult;
    }

    public static powerForSuccess(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('powerForSuccess was called');
        return combatResult;
    }

    public static strongAttackingShips(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('strongAttackingShips was called');
        return combatResult;
    }

    public static greatDefender(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('greatDefender was called');
        return combatResult;
    }

    public static fearfulnessEnemy(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('fearfulnessEnemy was called');
        return combatResult;
    }

    public static lonlyFighter(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('lonlyFighter was called');
        return combatResult;
    }

    public static replaceHousecard(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('replaceHousecard was called');
        return combatResult;
    }

    public static agonyOfFootman(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('agonyOfFootman was called');
        return combatResult;
    }

    public static longCombat(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('longCombat was called');
        return combatResult;
    }

    public static beStrong(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('beStrong was called');
        if (currentCard.house === combatResult.attackersCard.house) {
            combatResult.attackerStrength += 1;
        }
        else {
            combatResult.defenderStrength += 1;
        }
        return combatResult;
    }

    public static thwartInvasion(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('thwartInvasion was called');
        return combatResult;
    }

    public static lostInfluence(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('lostInfluence was called');
        return combatResult;
    }

}