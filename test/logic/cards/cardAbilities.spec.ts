import CardAbilities from '../../../src/logic/cards/cardAbilities';
import SupplyRules from '../../../src/logic/board/gameRules/supplyRules';
describe('CardAbilities', () => {
    describe('supply', () => {
        it(' should call updateSuppy', () => {
            spyOn(SupplyRules, 'updateSupply');
            CardAbilities.supply();
            expect(SupplyRules.updateSupply).toHaveBeenCalled();
        });
    });
});