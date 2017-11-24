import AreaBuilder from '../areaBuilder';
import {AreaKey} from '../../src/logic/board/areaKey';
import AiCalculator from '../../src/logic/ai/aiCalculator';
import {House} from '../../src/logic/board/house';
import {UnitType} from '../../src/logic/units/unitType';
describe('AiCalculator', () => {
    describe('controlledByOtherPlayerWithEnemyUnits', () => {
        it('should return false if area is not controlled by any house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by given house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by another house but has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return true if area is controlled by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });
    });
    describe('unOccupiedOrNoEnemies', () => {
        it('should return true if area is controlled by another house and has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return true if area is unoccupied', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return false if area isoccupied by own house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return false if area isoccupied by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
    });

});