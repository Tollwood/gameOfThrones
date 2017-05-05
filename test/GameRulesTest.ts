import GameRules from '../src/logic/gameRules';
import {House} from '../src/logic/house';
import {OrderToken, OrderTokenType} from '../src/logic/orderToken';
import GameState from '../src/logic/gameStati';
import {isUndefined} from 'util';
import Order = jasmine.Order;

describe('GameRules', () => {
    it('should be allowed to place a token on winterfell', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.tyrell, 'Winterfell')).toBe(false);
    });

    it('should not be allowed to place a token on an unknown area', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Unknown')).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Karhold')).toBe(false);
    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        let orderToken = new OrderToken(House.stark, OrderTokenType.march);
        GameState.getInstance().areas.filter((area) => {
            return area.getKey() === 'Winterfell';
        })[0].setOrderToken(orderToken);
        expect(GameRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(false);
    });

    it('should add OrderToken', () => {
        let orderToken: OrderToken = new OrderToken(House.stark, OrderTokenType.march);
        GameRules.addOrderToken(orderToken, 'Winterfell');
        let result: OrderToken = GameState.getInstance().areas.filter((area) => {
            return area.getKey() === 'Winterfell';
        })[0].getOrderToken();

        expect(result).toEqual(orderToken);
    });

    it('should continue the panning Phase while there are still Tokens to place', () => {
        expect(GameRules.allOrderTokenPlaced()).toBe(false);
    });

    it('should end the planningPhase the panning Phase while there are still Tokens to place', () => {
        GameState.getInstance().areas.map(area => {
            area.setOrderToken(new OrderToken(House.stark, OrderTokenType.march))
        });
        expect(GameRules.allOrderTokenPlaced()).toBe(true);
    });

    it('should reset the placed Tokens once PlanningPhase is finished', () => {
        GameRules.addOrderToken(new OrderToken(House.stark, OrderTokenType.march), 'Winterfell');
        expect(GameState.getInstance().areas.filter((area) => {
                return !isUndefined(area.getOrderToken())
            }).length === 0).toBe(false);
        GameRules.nextRound();
        expect(GameState.getInstance().areas.filter((area) => {
                return !isUndefined(area.getOrderToken())
            }).length === 0).toBe(true);
        expect(GameState.getInstance().round).toBe(2);
    });

});