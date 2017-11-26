import AreaBuilder from '../areaBuilder';
import {AreaKey} from '../../src/logic/board/areaKey';
import AiCalculator from '../../src/logic/ai/aiCalculator';
import {House} from '../../src/logic/board/house';
import {UnitType} from '../../src/logic/units/unitType';
import {OrderTokenType} from '../../src/logic/orderToken/orderTokenType';
import PossibleMove from '../../src/logic/ai/possibleMove';
import Order = jasmine.Order;
import MovementRules from '../../src/logic/board/gameRules/movementRules';
describe('AiCalculator', () => {
    let aiCalculator;
    beforeEach(()=>{
        aiCalculator = new AiCalculator();
    });

    describe('controlledByOtherPlayerWithEnemyUnits', () => {
        it('should return false if area is not controlled by any house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = aiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by given house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = aiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by another house but has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = aiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return true if area is controlled by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = aiCalculator.controlledByOtherPlayerWithEnemyUnits(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });
    });
    describe('unOccupiedOrNoEnemies', () => {
        it('should return true if area is controlled by another house and has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = aiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return true if area is unoccupied', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = aiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return false if area isoccupied by own house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = aiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return false if area isoccupied by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = aiCalculator.unOccupiedOrNoEnemies(area, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
    });
    describe('getAreasForHouseWithToken',()=>{
        it('should return the areas containing given tokens',()=>{
            const orderTokens = [OrderTokenType.march_special, OrderTokenType.raid_1];
            const areaWithMarchToken = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            const areaWithRaidToken = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withOrderToken(OrderTokenType.raid_1).build();
            const areaWithDefenseToken = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.defend_special).build();
            const areas = [areaWithRaidToken, areaWithDefenseToken,areaWithMarchToken];
            const actual = aiCalculator.getAreasForHouseWithToken(areas, House.stark, orderTokens);
            expect(actual.length).toBe(2);
            expect(actual.indexOf(areaWithMarchToken) > -1).toBeTruthy();
            expect(actual.indexOf(areaWithRaidToken) > -1).toBeTruthy();
        });
    });
    describe('getBestMove',()=>{
        it('should return null if no orderTokenTypes available',()=>{
           expect(aiCalculator.getBestMove(House.stark, null,[])).toBeNull();
        });

        it('should return the possible move with highest value',()=>{
            // given
            const availableOrderTokenTypes = [];
            const possibleMove1 = new PossibleMove(OrderTokenType.consolidatePower_special,null,0.5);
            const possibleMove2 = new PossibleMove(OrderTokenType.consolidatePower_special,null,1);
            spyOn(aiCalculator,'getAllPossibleMoves').and.returnValue([possibleMove1, possibleMove2]);

            // when
            const actual = aiCalculator.getBestMove(House.stark, null,availableOrderTokenTypes);
            // then
            expect(actual).toBe(possibleMove2);
            expect(aiCalculator.getAllPossibleMoves).toHaveBeenCalledWith(House.stark,null,availableOrderTokenTypes);
        });
    });
    describe('getAllPossibleMoves', ()=>{
        it('should return a possible move for consolidatePower_0',()=>{
            const actual = aiCalculator.getAllPossibleMoves(House.stark,null,[OrderTokenType.consolidatePower_0]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.consolidatePower_0);
            expect(actual[0].value).toBe(0.1);
        });

        it('should return a possible move for consolidatePower_0',()=>{
            const actual = aiCalculator.getAllPossibleMoves(House.stark,null,[OrderTokenType.consolidatePower_0]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.consolidatePower_0);
            expect(actual[0].value).toBe(0.1);
        });

        it('should return a possible move for march_zero',()=>{
            // given
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const area = new AreaBuilder(AreaKey.Winterfell).withBorders([whiteHarbor]).withUnits([UnitType.Horse]).build();
            spyOn(MovementRules,'getAllAreasAllowedToMarchTo').and.returnValue([whiteHarbor]);

            // when
            const actual = aiCalculator.getAllPossibleMoves(House.stark,area,[OrderTokenType.march_zero]);

            // then
            expect(MovementRules.getAllAreasAllowedToMarchTo).toHaveBeenCalledWith(area);
            expect(actual.length).toBe(1);
            const actualPossibleMove = actual[0];
            expect(actualPossibleMove.orderTokenType).toBe(OrderTokenType.march_zero);
            expect(actualPossibleMove.value).toBe(0);
            expect(actualPossibleMove.sourceArea).toEqual(area);
            expect(actualPossibleMove.targetArea).toEqual(whiteHarbor);
        });

        it('should return no possible move for march_zero order with no units',()=>{
            const area = new AreaBuilder(AreaKey.Winterfell).withBorders([]).withUnits([]).build();
            const actual = aiCalculator.getAllPossibleMoves(House.stark,area,[OrderTokenType.march_zero]);
            expect(actual.length).toBe(0);
        });

        it('should return a possible move for support_1',()=>{
            const actual = aiCalculator.getAllPossibleMoves(House.stark,null,[OrderTokenType.support_1]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.support_1);
            expect(actual[0].value).toBe(0);
        });

        it('should return a possible move for raid_1',()=>{
            const area = new AreaBuilder(AreaKey.Winterfell).withBorders([]).build();
            const actual = aiCalculator.getAllPossibleMoves(House.stark,area,[OrderTokenType.raid_1]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.raid_1);
            expect(actual[0].value).toBe(0);
        });

    });
});