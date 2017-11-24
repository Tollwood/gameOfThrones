import CardAbilities from '../../../src/logic/cards/cardAbilities';
import SupplyRules from '../../../src/logic/board/gameRules/supplyRules';
import CardFactory from '../../../src/logic/cards/cardFactory';
import CombatCalculator from '../../../src/logic/march/combatCalculator';
import AreaBuilder from '../../areaBuilder';
import {AreaKey} from '../../../src/logic/board/areaKey';
import {House} from '../../../src/logic/board/house';
import {UnitType} from '../../../src/logic/units/unitType';
import {OrderTokenType} from '../../../src/logic/orderToken/orderTokenType';
describe('CombatCalculator', () => {
    describe('calculateCombat', () => {
        it('calculateCombat ', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell)
                .withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withOrderToken(OrderTokenType.defend_1)
                .build();
            const actual = CombatCalculator.calculateCombat(sourceArea, targetArea);
            expect(actual.winner).toBe(targetArea.controllingHouse);
            expect(actual.attackerStrength).toBe(0);
            expect(actual.defenderStrength).toBe(2);

        });
        it('should calculate combat if target area has no token', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell)
                .withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withOrderToken(OrderTokenType.march_special)
                .build();
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .build();
            const actual = CombatCalculator.calculateCombat(sourceArea, targetArea);
            expect(actual.winner).toBe(targetArea.controllingHouse);
            expect(actual.attackerStrength).toBe(2);
            expect(actual.defenderStrength).toBe(1);
        });

        it('should calculate combat for horse and siege', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell)
                .withHouse(House.stark)
                .withUnits([UnitType.Siege])
                .withOrderToken(OrderTokenType.march_zero)
                .build();
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withUnits([UnitType.Horse])
                .build();
            const actual = CombatCalculator.calculateCombat(sourceArea, targetArea);
            expect(actual.attackerStrength).toBe(4);
            expect(actual.defenderStrength).toBe(2);
        });


        it('should calculate combat for ship', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell)
                .withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withOrderToken(OrderTokenType.march_zero)
                .build();
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .build();
            const actual = CombatCalculator.calculateCombat(sourceArea, targetArea);
            expect(actual.attackerStrength).toBe(1);
            expect(actual.defenderStrength).toBe(1);
        });

        xit('Siege Engine should add 4 combat strengh (attack) when target area contains a castle', () => {
            fail();
        });

        xit('Siege Engine should add 4 combat strengh (attack) when target area contains a stronghold', () => {
            fail();
        });

        xit('Siege Engine should add 4 combat strengh (defense) when target area contains a castle', () => {
            fail();
        });

        xit('Siege Engine should add 4 combat strengh (defense) when target area contains a stronghold', () => {
            fail();
        });

        xit('Siege Engine should add no combat strengh when target area contains neither stronghold nor castle', () => {
            fail();
        });
    });
});