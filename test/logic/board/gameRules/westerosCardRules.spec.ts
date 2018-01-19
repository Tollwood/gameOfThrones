import WesterosCardRules from '../../../../src/logic/board/gameRules/westerosCardRules';
import {WesterosCard} from '../../../../src/logic/cards/westerosCard';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
import {TSMap} from 'typescript-map';

describe('WesterosCardRules', () => {



    describe('getNextCard', () => {
        it('should play westerosCards1 if cardTpye is 1', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS1, 1, []);
            const westerosCards: TSMap<GamePhase, WesterosCard[]> = new TSMap();
            westerosCards.set(GamePhase.WESTEROS1, [expectedCard]);
            const gameState = {
                gamePhase: GamePhase.WESTEROS1,
                westerosCards
            };
            const card: WesterosCard = WesterosCardRules.getNextCard(gameState);
            expect(card).toEqual(expectedCard);
        });
    });


});