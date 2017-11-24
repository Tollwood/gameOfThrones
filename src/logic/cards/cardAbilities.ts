import CombatResult from '../march/combatResult';
import HouseCard from './houseCard';
import {WesterosCard} from './westerosCard';
import SupplyRules from '../board/gameRules/supplyRules';
import RecruitingRules from '../board/gameRules/recruitingRules';
import TokenPlacementRules from '../board/gameRules/tokenPlacementRules';
import GameRules from '../board/gameRules/gameRules';
import {OrderTokenType} from '../orderToken/orderTokenType';

export default class CardAbilities {
    public static getAllCardsBack(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        GameRules.gameState.players
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
        /* let defenderHouse = combatResult.defendingArea.controllingHouse;
        let defenderCardHouse = combatResult.defendersCard.house;
        if (defenderCardHouse === defenderHouse && combatResult.defendingArea.orderToken.isDefendToken()) {
            combatResult.defenderStrength += combatResult.defendingArea.orderToken.value;

         }*/
        return combatResult;
    }

    public static noLossesDuringFight(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        console.log('noLossesDuringFight was called');
        return combatResult;
    }

    public static fightForStannisBaratheon(currentCard: HouseCard, combatResult: CombatResult): CombatResult {
        GameRules.gameState.players
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
        /*
         //switch House -> Player
         let opponent: Player = combatResult.attackersCard.house === currentCard.house ? combatResult.defendersCard.house : combatResult.attackersCard.house;

        if (GameRules.gameState.ironThroneSuccession.indexOf(currentCard.house) > GameRules.gameState.ironThroneSuccession.indexOf(opponent)) {

        }
        if (currentCard.house === combatResult.attackersCard.house) {
            combatResult.attackerStrength += 1;
        }
        else {
            combatResult.defenderStrength += 1;
         }*/
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
        /*if (currentCard.house === combatResult.attackersCard.house) {
            combatResult.attackerStrength += 1;
        }
        else {
            combatResult.defenderStrength += 1;
        }
         */
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


    public static shuffleCards(card: WesterosCard) {
        console.log('shuffle');
    }

    public static supply(card?: WesterosCard) {
        SupplyRules.updateSupply();
    }

    public static recruit(card: WesterosCard) {
        RecruitingRules.setAreasAllowedToRecruit();
    }

    public static nothing(card: WesterosCard) {
        // does nothing
    }

    public static invluence(card: WesterosCard) {
        console.log('invluence');
    }

    public static power(card: WesterosCard) {
        TokenPlacementRules.consolidateAllPower();
    }

    public static noDefenseOrders(card: WesterosCard) {
        let restrictedTokenTypes = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
        TokenPlacementRules.restrictOrderToken(restrictedTokenTypes);
    }

    public static noSpecialMarchOrder(card: WesterosCard) {
        let restrictedTokenTypes = [OrderTokenType.march_special];
        TokenPlacementRules.restrictOrderToken(restrictedTokenTypes);
    }

    public static noRaidOrders(card: WesterosCard) {
        let restrictedTokenTypes = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
        TokenPlacementRules.restrictOrderToken(restrictedTokenTypes);
    }

    public static noConsolidatePowerOrders(card: WesterosCard) {
        let restrictedTokenTypes = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];
        TokenPlacementRules.restrictOrderToken(restrictedTokenTypes);
    }

    public static noSupportOrders(card: WesterosCard) {
        let restrictedTokenTypes = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
        TokenPlacementRules.restrictOrderToken(restrictedTokenTypes);
    }

    public static wildlingAttack(card: WesterosCard) {
        console.log('wildlingAttack');
    }
}