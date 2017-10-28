import AreaRules from '../../../../src/logic/board/gameRules/AreaRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import AreaBuilder from '../../../areaBuilder';

describe('AreaRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should return the true for adjacent areas', () => {

        // given
        let karhold = new AreaBuilder('Karhold').addToGameState(gameState).build();
        let winterfell = new AreaBuilder('Winterfell').addToGameState(gameState).withBorders([karhold]).build();
        GameRules.load(gameState);
        //when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        //then
        expect(actual).toBeTruthy();

    });

    it('should return the false for non adjacent areas', () => {

        // given
        let karhold = new AreaBuilder('Karhold').addToGameState(gameState).build();
        let winterfell = new AreaBuilder('Winterfell').addToGameState(gameState).withBorders([karhold]).build();
        GameRules.load(gameState);
        //when
        let actual = AreaRules.isConnectedArea( karhold, winterfell);

        //then
        expect(actual).toBeFalsy();

    });

});