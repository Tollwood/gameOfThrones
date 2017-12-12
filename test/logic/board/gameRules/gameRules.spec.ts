import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
import {gameStore, INITIALLY_ALLOWED_ORDER_TOKEN_TYPES} from '../../../../src/logic/board/gameState/reducer';
describe('GameRules', () => {
    describe('newGame', () => {
        it('should initiziale a Game with 6 players', () => {
            GameRules.newGame();
            const state = gameStore.getState();
            expect(state.gameRound).toBe(1);
            expect(state.gamePhase).toBe(GamePhase.WESTEROS1);
            expect(state.wildlingsCount).toBe(0);
            expect(state.currentHouse).toBe(state.ironThroneSuccession[0]);
            expect(state.currentlyAllowedTokenTypes).toEqual(INITIALLY_ALLOWED_ORDER_TOKEN_TYPES);
        });
    });
});