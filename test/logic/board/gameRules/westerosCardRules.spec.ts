import WesterosCardRules from '../../../../src/logic/board/gameRules/westerosCardRules';
import {WesterosCard} from '../../../../src/logic/cards/westerosCard';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
import {TSMap} from 'typescript-map';

describe('WesterosCardRules', () => {



    describe('getNextCard', () => {
        it('should play westerosCards1 if cardTpye is 1', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS1, 1, []);
            const gameState = {westerosCards: new TSMap().set(GamePhase.WESTEROS1, [expectedCard])};
            const card: WesterosCard = WesterosCardRules.getNextCard(1);
            expect(card).toEqual(expectedCard);
        });

        it('should play westerosCards2 if cardTpye is 2', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS2, 1, []);
            const gameState = {westerosCards: new TSMap().set(GamePhase.WESTEROS2, [expectedCard])};
            const card: WesterosCard = WesterosCardRules.getNextCard(2);
            expect(card).toEqual(expectedCard);
        });

        it('should play westerosCards3 if cardTpye is 3', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS3, 1, []);
            const cards = new TSMap<GamePhase, WesterosCard[]>();
            cards.set(GamePhase.WESTEROS3, [expectedCard]);
            const gameState = {westerosCards: cards, gamePhase: GamePhase.WESTEROS3};
            const card: WesterosCard = WesterosCardRules.getNextCard(gameState);
            expect(card).toEqual(expectedCard);
        });
    });


});