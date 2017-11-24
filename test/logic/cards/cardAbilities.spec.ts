import CardAbilities from '../../../src/logic/cards/cardAbilities';
import SupplyRules from '../../../src/logic/board/gameRules/supplyRules';
import Player from '../../../src/logic/board/player';
import {House} from '../../../src/logic/board/house';
import HousecCard from '../../../src/logic/cards/houseCard';
import HouseCardBuilder from '../../HouseCardBuilder';
import GameRules from '../../../src/logic/board/gameRules/gameRules';
import GameState from '../../../src/logic/board/gameState/GameState';
import CombatResult from '../../../src/logic/march/combatResult';
import TokenPlacementRules from '../../../src/logic/board/gameRules/tokenPlacementRules';
import {OrderTokenType} from '../../../src/logic/orderToken/orderTokenType';
describe('CardAbilities', () => {
    let gameState: GameState;
    const combatResult = new CombatResult(null, null, 0, 0);
    beforeEach(() => {
        gameState = new GameState();
        gameState.players = [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])];
    });


    describe('supply', () => {
        it(' should call updateSuppy', () => {
            spyOn(SupplyRules, 'updateSupply');
            CardAbilities.supply();
            expect(SupplyRules.updateSupply).toHaveBeenCalled();
        });
    });

    describe('getAllCardsBack', () => {
        it(' should set all cards of player playing the card to not played', () => {
            // given

            const houseCard1 = new HouseCardBuilder().house(House.stark).played().build();
            const houseCard2 = new HouseCardBuilder().house(House.stark).build();
            const cards: HousecCard[] = [houseCard1, houseCard2];
            const playerStark = new Player(House.stark, 0, cards);
            gameState.players = [playerStark];
            GameRules.load(gameState);

            // when
            const actual = CardAbilities.getAllCardsBack(houseCard2, combatResult);

            // then
            expect(actual).toBe(combatResult);
            expect(houseCard1.played).toBeFalsy();
            expect(houseCard2.played).toBeFalsy();


        });
    });

    describe('defineEnemiesRetreat', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.defineEnemiesRetreat(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('doubleDefenseToken', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.doubleDefenseToken(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('doubleDefenseToken', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.doubleDefenseToken(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('noLossesDuringFight', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.noLossesDuringFight(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('fightForStannisBaratheon', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.fightForStannisBaratheon(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('navelPowerThroughSupport', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.navelPowerThroughSupport(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('dropAdditionalEnemiesCard', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.dropAdditionalEnemiesCard(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('demandForPower', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.demandForPower(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('accolade', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.accolade(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('removeEnemiesOrderTokenForSuccess', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.removeEnemiesOrderTokenForSuccess(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('denyEnemiesHouseCard', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.denyEnemiesHouseCard(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });
    describe('powerForSuccess', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.powerForSuccess(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('strongAttackingShips', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.strongAttackingShips(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('agonyOfFootman', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.agonyOfFootman(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('replaceHousecard', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.replaceHousecard(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('lonlyFighter', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.lonlyFighter(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('fearfulnessEnemy', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.fearfulnessEnemy(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('greatDefender', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.greatDefender(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('lostInfluence', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.lostInfluence(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('thwartInvasion', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.thwartInvasion(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('beStrong', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.beStrong(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('longCombat', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.longCombat(null, combatResult);
            expect(actual).toBe(combatResult);
        });
    });

    describe('invluence', () => {
        it(' should do nothing for now', () => {
            const actual = CardAbilities.invluence(null);
        });
    });

    describe('nothing', () => {
        it(' should do nothing for now', () => {
            CardAbilities.nothing(null);
        });
    });

    describe('recruit', () => {
        it(' should do nothing for now', () => {
            CardAbilities.recruit(null);
        });
    });

    describe('shuffleCards', () => {
        it(' should do nothing for now', () => {
            CardAbilities.shuffleCards(null);
        });
    });

    describe('noConsolidatePowerOrders', () => {
        it(' should remove consolidate power Orders from currentlyAllowedTokenTypes', () => {
            // given
            gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
            GameRules.load(gameState);
            // when
            CardAbilities.noConsolidatePowerOrders(null);

            // then
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_0)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_1)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_special)).toBe(-1);
        });
    });

    describe('noRaidOrders', () => {
        it(' should do nothing for now', () => {
            // given
            gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
            GameRules.load(gameState);
            // when
            CardAbilities.noRaidOrders(null);

            // then
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_0)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_1)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_special)).toBe(-1);

        });
    });

    describe('noSpecialMarchOrder', () => {
        it(' should remove march special Order from currentlyAllowedTokenTypes', () => {
            gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
            GameRules.load(gameState);
            CardAbilities.noSpecialMarchOrder(null);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.march_special)).toBe(-1);
        });
    });

    describe('noDefenseOrders', () => {
        it('should remove defense Orders from currentlyAllowedTokenTypes', () => {
            gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
            GameRules.load(gameState);
            CardAbilities.noDefenseOrders(null);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_1)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_0)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_special)).toBe(-1);
        });
    });
    describe('power', () => {
        it(' should do nothing for now', () => {
            CardAbilities.power(null);
        });
    });

    describe('wildlingAttack', () => {
        it(' should do nothing for now', () => {
            CardAbilities.wildlingAttack(null);
        });
    });

    describe('noSupportOrders', () => {
        it(' should remove the support token for currently allowedOrderTokenTypes', () => {
            gameState.currentlyAllowedTokenTypes = TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES;
            GameRules.load(gameState);
            CardAbilities.noSupportOrders(null);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_0)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_1)).toBe(-1);
            expect(gameState.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_special)).toBe(-1);
        });
    });
});