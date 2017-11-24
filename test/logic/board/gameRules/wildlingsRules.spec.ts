import GameState from '../../../../src/logic/board/gameState/GameState';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import WildlingRules from '../../../../src/logic/board/gameRules/wildlingRules';
describe('VictoryRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    describe('increaseWildlings', () => {
        it('should increase wilding count by given value', () => {
            gameState.wildlingsCount = 3;
            GameRules.load(gameState);
            WildlingRules.increaseWildlings(2);
            expect(gameState.wildlingsCount).toBe(5);
        });

        it('should limit the wildlingCount to twelve', () => {
            gameState.wildlingsCount = 11;
            GameRules.load(gameState);
            WildlingRules.increaseWildlings(2);
            expect(gameState.wildlingsCount).toBe(12);
        });
    });
});