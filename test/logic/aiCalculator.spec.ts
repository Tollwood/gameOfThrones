import AreaBuilder from '../areaBuilder';
import {AreaKey} from '../../src/logic/board/areaKey';
import AiCalculator from '../../src/logic/ai/aiCalculator';
import {House} from '../../src/logic/board/house';
import {UnitType} from '../../src/logic/units/unitType';
import {OrderTokenType} from '../../src/logic/orderToken/orderTokenType';
import PossibleMove from '../../src/logic/ai/possibleMove';
import StateSelectorService from '../../src/logic/board/gameRules/stateSelectorService';
import {gameStore} from '../../src/logic/board/gameState/reducer';

describe('AiCalculator', () => {

    describe('controlledByOtherPlayerWithEnemyUnits', () => {
        it('should return false if area is not controlled by any house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area.key, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by given house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area.key, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
        it('should return false if area is controlled by another house but has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area.key, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return true if area is controlled by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = AiCalculator.controlledByOtherPlayerWithEnemyUnits(area.key, House.stark);
            // then
            expect(actual).toBeTruthy();
        });
    });
    describe('unOccupiedOrNoEnemies', () => {
        it('should return true if area is controlled by another house and has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area.key, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return true if area is unoccupied', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area.key, House.stark);
            // then
            expect(actual).toBeTruthy();
        });

        it('should return false if area isoccupied by own house', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area.key, House.stark);
            // then
            expect(actual).toBeFalsy();
        });

        it('should return false if area isoccupied by another house and has units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            // when
            const actual = AiCalculator.unOccupiedOrNoEnemies(area.key, House.stark);
            // then
            expect(actual).toBeFalsy();
        });
    });
    describe('getAreasForHouseWithToken', () => {
        it('should return the areas containing given tokens', () => {
            const orderTokens = [OrderTokenType.march_special, OrderTokenType.raid_1];
            const areaWithMarchToken = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            const areaWithRaidToken = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withOrderToken(OrderTokenType.raid_1).build();
            const areaWithDefenseToken = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.defend_special).build();
            const areas = [areaWithRaidToken, areaWithDefenseToken, areaWithMarchToken];
            const actual = AiCalculator.getAreasForHouseWithToken(areas, House.stark, orderTokens);
            expect(actual.length).toBe(2);
            expect(actual.indexOf(areaWithMarchToken) > -1).toBeTruthy();
            expect(actual.indexOf(areaWithRaidToken) > -1).toBeTruthy();
        });
    });
    describe('getBestMove', () => {
        it('should return null if no orderTokenTypes available', () => {
            expect(AiCalculator.getBestMove(House.stark, null, [])).toBeNull();
        });

        it('should return the possible move with highest value', () => {
            // given
            const availableOrderTokenTypes = [];
            const possibleMove1 = new PossibleMove(OrderTokenType.consolidatePower_special, null, 0.5);
            const possibleMove2 = new PossibleMove(OrderTokenType.consolidatePower_special, null, 1);
            spyOn(AiCalculator, 'getAllPossibleMoves').and.returnValue([possibleMove1, possibleMove2]);

            // when
            const actual = AiCalculator.getBestMove(House.stark, null, availableOrderTokenTypes);
            // then
            expect(actual).toBe(possibleMove2);
            expect(AiCalculator.getAllPossibleMoves).toHaveBeenCalledWith(House.stark, null, availableOrderTokenTypes);
        });
    });
    describe('getAllPossibleMoves', () => {
        it('should return a possible move for consolidatePower_0', () => {
            const actual = AiCalculator.getAllPossibleMoves(House.stark, null, [OrderTokenType.consolidatePower_0]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.consolidatePower_0);
            expect(actual[0].value).toBe(0.1);
        });

        it('should return a possible move for consolidatePower_0', () => {
            const actual = AiCalculator.getAllPossibleMoves(House.stark, null, [OrderTokenType.consolidatePower_0]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.consolidatePower_0);
            expect(actual[0].value).toBe(0.1);
        });

        it('should return a possible move for march_zero', () => {
            // given
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const area = new AreaBuilder(AreaKey.Winterfell).withUnits([UnitType.Horse]).build();
            const state = {};
            spyOn(gameStore, 'getState').and.returnValue(state);
            spyOn(StateSelectorService, 'getAllAreasAllowedToMarchTo').and.returnValue([whiteHarbor]);

            // when
            const actual = AiCalculator.getAllPossibleMoves(House.stark, area, [OrderTokenType.march_zero]);

            // then
            expect(StateSelectorService.getAllAreasAllowedToMarchTo).toHaveBeenCalledWith(state, area);
            expect(actual.length).toBe(1);
            const actualPossibleMove = actual[0];
            expect(actualPossibleMove.orderTokenType).toBe(OrderTokenType.march_zero);
            expect(actualPossibleMove.value).toBe(0);
            expect(actualPossibleMove.sourceAreaKey).toEqual(area.key);
            expect(actualPossibleMove.targetAreaKey).toEqual(whiteHarbor.key);
        });

        it('should return no possible move for march_zero order with no units', () => {
            const area = new AreaBuilder(AreaKey.Winterfell).withUnits([]).build();
            const actual = AiCalculator.getAllPossibleMoves(House.stark, area, [OrderTokenType.march_zero]);
            expect(actual.length).toBe(0);
        });

        it('should return a possible move for support_1', () => {
            const actual = AiCalculator.getAllPossibleMoves(House.stark, null, [OrderTokenType.support_1]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.support_1);
            expect(actual[0].value).toBe(0);
        });

        it('should return a possible move for raid_1', () => {
            const area = new AreaBuilder(AreaKey.Winterfell).build();
            const actual = AiCalculator.getAllPossibleMoves(House.stark, area, [OrderTokenType.raid_1]);
            expect(actual.length).toBe(1);
            expect(actual[0].orderTokenType).toBe(OrderTokenType.raid_1);
            expect(actual[0].value).toBe(0);
        });

    });
});