import GameRules from '../../../../src/board/logic/gameRules/gameRules';
import GameState from '../../../../src/board/logic/gameState/GameState';
import TestUtil from '../../../testUtil';
import Order = jasmine.Order;
import AreaRules from '../../../../src/board/logic/gameRules/AreaRules';

describe('SupplyRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should return the true for adjacent areas', () => {

        // given
        let karhold = TestUtil.defineArea(gameState, 'Karhold', null, [], [], null);
        let winterfell = TestUtil.defineArea(gameState, 'Winterfell', null, [], [karhold], null);
        GameRules.load(gameState);
        //when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        //then
        expect(actual).toBeTruthy();

    });

    it('should return the false for non adjacent areas', () => {

        // given
        let karhold = TestUtil.defineArea(gameState, 'Karhold', null, [], [], null);
        let winterfell = TestUtil.defineArea(gameState, 'Winterfell', null, [], [karhold], null);
        GameRules.load(gameState);
        //when
        let actual = AreaRules.isConnectedArea( karhold, winterfell);

        //then
        expect(actual).toBeFalsy();

    });

});