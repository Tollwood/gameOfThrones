import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {increaseWildlingCount, loadGame} from '../../../../src/logic/board/gameState/actions';
describe('VictoryRules', () => {

    describe('increaseWildlings', () => {
        it('should increase wilding count by given value', () => {
            const gameStoreState = {wildlingsCount: 3};
            gameStore.dispatch(loadGame(gameStoreState));
            gameStore.dispatch(increaseWildlingCount(2));
            expect(gameStore.getState().wildlingsCount).toBe(5);
        });

        it('should limit the wildlingCount to twelve', () => {
            const gameStoreState = {wildlingsCount: 11};
            gameStore.dispatch(loadGame(gameStoreState));
            gameStore.dispatch(increaseWildlingCount(2));
            expect(gameStore.getState().wildlingsCount).toBe(12);
        });
    });
});