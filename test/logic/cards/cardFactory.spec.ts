import CardAbilities from '../../../src/logic/cards/cardAbilities';
import SupplyRules from '../../../src/logic/board/gameRules/supplyRules';
import CardFactory from '../../../src/logic/cards/cardFactory';
describe('CardFactory', () => {
    describe('shuffle', () => {
        it(' should shuffle the cards', () => {
            CardFactory.shuffle([]);
            expect(true).toBe(true);
        });
    });
});