"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameRules_1 = require("../src/logic/gameRules");
var house_1 = require("../src/logic/house");
var orderToken_1 = require("../src/logic/orderToken");
var gameStati_1 = require("../src/logic/gameStati");
var util_1 = require("util");
describe('GameRules', function () {
    it('should be allowed to place a token on winterfell', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Winterfell')).toBe(true);
    });
    it('should not be allowed to place a token on an field that is not occupied by the house', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.tyrell, 'Winterfell')).toBe(false);
    });
    it('should not be allowed to place a token on an unknown area', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Unknown')).toBe(false);
    });
    it('should not be allowed to place a token on an area with not units', function () {
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Karhold')).toBe(false);
    });
    it('should not be allowed to place a token on an area with an orderToken already placed', function () {
        var orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march);
        gameStati_1.default.getInstance().areas.filter(function (area) { return area.getKey() === 'Winterfell'; })[0].setOrderToken(orderToken);
        expect(gameRules_1.default.isAllowedToPlaceOrderToken(house_1.House.stark, 'Winterfell')).toBe(false);
    });
    it('should add OrderToken', function () {
        var orderToken = new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march);
        gameRules_1.default.addOrderToken(orderToken, 'Winterfell');
        var result = gameStati_1.default.getInstance().areas.filter(function (area) {
            return area.getKey() === 'Winterfell';
        })[0].getOrderToken();
        expect(result).toEqual(orderToken);
    });
    it('should continue the panning Phase while there are still Tokens to place', function () {
        expect(gameRules_1.default.allOrderTokenPlaced()).toBe(false);
    });
    it('should end the planningPhase the panning Phase while there are still Tokens to place', function () {
        gameStati_1.default.getInstance().areas.map(function (area) { area.setOrderToken(new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march)); });
        expect(gameRules_1.default.allOrderTokenPlaced()).toBe(true);
    });
    it('should reset the placed Tokens once PlanningPhase is finished', function () {
        gameRules_1.default.addOrderToken(new orderToken_1.OrderToken(house_1.House.stark, orderToken_1.OrderTokenType.march), 'Winterfell');
        expect(gameStati_1.default.getInstance().areas.filter(function (area) { return !util_1.isUndefined(area.getOrderToken()); }).length === 0).toBe(false);
        gameRules_1.default.nextRound();
        expect(gameStati_1.default.getInstance().areas.filter(function (area) { return !util_1.isUndefined(area.getOrderToken()); }).length === 0).toBe(true);
        expect(gameStati_1.default.getInstance().round).toBe(2);
    });
});
