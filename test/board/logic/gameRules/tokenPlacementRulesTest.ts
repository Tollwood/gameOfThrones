import GameRules from '../../../../src/board/logic/gameRules/gameRules';
import {House} from '../../../../src/board/logic/house';
import {OrderToken, OrderTokenType} from '../../../../src/orderToken/logic/orderToken';
import TokenPlacementRules from '../../../../src/board/logic/gameRules/tokenPlacementRules';
import Order = jasmine.Order;

describe('GameRules', () => {

    beforeEach(() => {
        GameRules.newGame();
    });

    it('should be allowed to place a token on winterfell', () => {
        expect(TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(true);
    });

    it('should not be allowed to place a token on an field that is not occupied by the house', () => {
        expect(TokenPlacementRules.isAllowedToPlaceOrderToken(House.tyrell, 'Winterfell')).toBe(false);
    });

    it('should not be allowed to place a token on an area with not units', () => {
        expect(TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, 'Karhold')).toBe(false);
    });

    it('should not be allowed to place a token on an area with an orderToken already placed', () => {
        let orderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        GameRules.gameState.areas.filter((area) => {
            return area.key === 'Winterfell';
        })[0].orderToken = orderToken;
        expect(TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, 'Winterfell')).toBe(false);
    });

    it('should add OrderToken', () => {
        let orderToken: OrderToken = new OrderToken(House.stark, OrderTokenType.march_minusOne);
        TokenPlacementRules.addOrderToken(orderToken, 'Winterfell');
        let result: OrderToken = GameRules.gameState.areas.filter((area) => {
            return area.key === 'Winterfell';
        })[0].orderToken;

        expect(result).toEqual(orderToken);
    });
});