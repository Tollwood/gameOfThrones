import GameRules from '../src/board/logic/gameRules';
import {House} from '../src/board/logic/house';
import {OrderToken, OrderTokenType} from '../src/orderToken/logic/orderToken';
import GameState from '../src/board/logic/gameStati';
import Unit from '../src/units/logic/units';
import {UnitType} from '../src/units/logic/unitType';
import Order = jasmine.Order;

describe('GameRules', () => {

    beforeEach(() => {
        GameState.resetGame();
    });
    it('should be allowed to place a token on winterfell', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.tyrell, 'Winterfell')).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Karhold')).toBe(false);
    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        let orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameState.getInstance().areas.filter((area) => {
            return area.key === 'Winterfell';
        })[0].orderToken = orderToken;
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(false);
    });

    it('should add OrderToken', () => {
        let orderToken: OrderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.addOrderToken(orderToken, 'Winterfell');
        let result: OrderToken = GameState.getInstance().areas.filter((area) => {
            return area.key === 'Winterfell';
        })[0].orderToken;

        expect(result).toEqual(orderToken);
    });

    it('should continue the panning Phase while there are still Tokens to place', () => {
        expect(GameRules.allOrderTokenPlaced(House.stark)).toBe(false);
    });

    it('should end the planningPhase the panning Phase while there are still Tokens to place', () => {
        GameState.getInstance().areas.map(area => {
            area.orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        });
        expect(GameRules.allOrderTokenPlaced(House.stark)).toBe(true);
    });

    it('should move units from one area to another', () => {
        GameRules.getAreaByKey('Winterfell').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('Winterfell', 'Karhold', new Unit(UnitType.Footman, House.stark));
        let winterfell = GameRules.getAreaByKey('Winterfell');
        expect(winterfell.units.length).toBe(0);
        expect(winterfell.orderToken).toBeUndefined();
        expect(GameRules.getAreaByKey('Karhold').units.length).toBe(2);
    });

    it('should move land units from one area to another over the sea using a friendly ship', () => {
        GameRules.getAreaByKey('WhiteHarbor').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('WhiteHarbor', 'CastleBlack', new Unit(UnitType.Footman, House.stark));
        let winterfell = GameRules.getAreaByKey('WhiteHarbor');
        expect(winterfell.units.length).toBe(0);
        expect(winterfell.orderToken).toBeUndefined();
        expect(GameRules.getAreaByKey('CastleBlack').units.length).toBe(1);
    });

    it('should not move unit if unit is not present in source area ', () => {
        GameRules.getAreaByKey('Winterfell').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('Winterfell', 'Karhold', new Unit(UnitType.Siege, House.stark));
        let winterfell = GameRules.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });

    it('should not move unit into an enemy area ', () => {
        GameRules.getAreaByKey('Winterfell').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.getAreaByKey('Karhold').units.push(new Unit(UnitType.Horse, House.baratheon));
        GameRules.moveUnits('Winterfell', 'Karhold', new Unit(UnitType.Footman, House.stark));
        let winterfell = GameRules.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });

    it('should not move land unit into a sea area ', () => {
        GameRules.getAreaByKey('Winterfell').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('Winterfell', 'TheShiveringSea', new Unit(UnitType.Footman, House.stark));
        let winterfell = GameRules.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });

    it('should not move sea unit into a land area ', () => {
        GameRules.getAreaByKey('TheShiveringSea').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('TheShiveringSea', 'Winterfell', new Unit(UnitType.Ship, House.stark));
        let theShiveringSea = GameRules.getAreaByKey('TheShiveringSea');
        expect(theShiveringSea.orderToken).toBeDefined();

    });

    it('should not move units from one area to another if areas are not adjacent', () => {
        let winterfell = GameRules.getAreaByKey('Winterfell');
        GameRules.getAreaByKey('Winterfell').orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.moveUnits('Winterfell', 'Starfall', new Unit(UnitType.Footman, House.stark));
        expect(winterfell.units.length).toBeGreaterThan(0);

        expect(winterfell.orderToken).toBeDefined();
    });
});