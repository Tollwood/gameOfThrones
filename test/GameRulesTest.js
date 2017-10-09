"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameRules_1 = require("../src/board/logic/gameRules");
var house_1 = require("../src/board/logic/house");
var orderToken_1 = require("../src/orderToken/logic/orderToken");
var gameStati_1 = require("../src/board/logic/gameStati");
var units_1 = require("../src/units/logic/units");
var unitType_1 = require("../src/units/logic/unitType");
describe('GameRules', function () {
    beforeEach(function () {
        gameStati_1.default.resetGame();
    });
    it('should be allowed to place a token on winterfell', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Winterfell')).toBe(true);
    });
    it('should not be allowed to place a token on an field that is not occupied by the house', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.tyrell, 'Winterfell')).toBe(false);
    });
    it('should not be allowed to place a token on an area with not units', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Karhold')).toBe(false);
    });
    it('should not be allowed to place a token on an area with an orderToken already placed', function () {
        var orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameStati_1.default.getInstance().areas.filter(function (area) {
            return area.key === 'Winterfell';
        })[0].orderToken = orderToken;
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Winterfell')).toBe(false);
    });
    it('should add OrderToken', function () {
        var orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.addOrderToken(orderToken, 'Winterfell');
        var result = gameStati_1.default.getInstance().areas.filter(function (area) {
            return area.key === 'Winterfell';
        })[0].orderToken;
        expect(result).toEqual(orderToken);
    });
    it('should continue the panning Phase while there are still Tokens to place', function () {
        expect(gameRules_1.default.allOrderTokenPlaced(house_1.House.stark)).toBe(false);
    });
    it('should end the planningPhase the panning Phase while there are still Tokens to place', function () {
        gameStati_1.default.getInstance().areas.map(function (area) {
            area.orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        });
        expect(gameRules_1.default.allOrderTokenPlaced(house_1.House.stark)).toBe(true);
    });
    it('should move units from one area to another', function () {
        gameRules_1.default.getAreaByKey('Winterfell').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('Winterfell', 'Karhold', new units_1.default(unitType_1.UnitType.Footman, house_1.House.stark));
        var winterfell = gameRules_1.default.getAreaByKey('Winterfell');
        expect(winterfell.units.length).toBe(0);
        expect(winterfell.orderToken).toBeUndefined();
        expect(gameRules_1.default.getAreaByKey('Karhold').units.length).toBe(2);
    });
    it('should move land units from one area to another over the sea using a friendly ship', function () {
        gameRules_1.default.getAreaByKey('WhiteHarbor').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('WhiteHarbor', 'CastleBlack', new units_1.default(unitType_1.UnitType.Footman, house_1.House.stark));
        var winterfell = gameRules_1.default.getAreaByKey('WhiteHarbor');
        expect(winterfell.units.length).toBe(0);
        expect(winterfell.orderToken).toBeUndefined();
        expect(gameRules_1.default.getAreaByKey('CastleBlack').units.length).toBe(1);
    });
    it('should not move unit if unit is not present in source area ', function () {
        gameRules_1.default.getAreaByKey('Winterfell').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('Winterfell', 'Karhold', new units_1.default(unitType_1.UnitType.Siege, house_1.House.stark));
        var winterfell = gameRules_1.default.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });
    it('should not move unit into an enemy area ', function () {
        gameRules_1.default.getAreaByKey('Winterfell').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.getAreaByKey('Karhold').units.push(new units_1.default(unitType_1.UnitType.Horse, house_1.House.baratheon));
        gameRules_1.default.moveUnits('Winterfell', 'Karhold', new units_1.default(unitType_1.UnitType.Footman, house_1.House.stark));
        var winterfell = gameRules_1.default.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });
    it('should not move land unit into a sea area ', function () {
        gameRules_1.default.getAreaByKey('Winterfell').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('Winterfell', 'TheShiveringSea', new units_1.default(unitType_1.UnitType.Footman, house_1.House.stark));
        var winterfell = gameRules_1.default.getAreaByKey('Winterfell');
        expect(winterfell.orderToken).toBeDefined();
    });
    it('should not move sea unit into a land area ', function () {
        gameRules_1.default.getAreaByKey('TheShiveringSea').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('TheShiveringSea', 'Winterfell', new units_1.default(unitType_1.UnitType.Ship, house_1.House.stark));
        var theShiveringSea = gameRules_1.default.getAreaByKey('TheShiveringSea');
        expect(theShiveringSea.orderToken).toBeDefined();
    });
    it('should not move units from one area to another if areas are not adjacent', function () {
        var winterfell = gameRules_1.default.getAreaByKey('Winterfell');
        gameRules_1.default.getAreaByKey('Winterfell').orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march_minusOne);
        gameRules_1.default.moveUnits('Winterfell', 'Starfall', new units_1.default(unitType_1.UnitType.Footman, house_1.House.stark));
        expect(winterfell.units.length).toBeGreaterThan(0);
        expect(winterfell.orderToken).toBeDefined();
    });
});
