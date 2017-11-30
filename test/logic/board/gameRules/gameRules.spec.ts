import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
import TokenPlacementRules from '../../../../src/logic/board/gameRules/tokenPlacementRules';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
describe('GameRules', ()=>{
    describe('newGame', ()=>{
        it('should initiziale a Game with 6 players', ()=>{

            GameRules.newGame();
            const gameState = GameRules.save();

            expect(gameStore.getState().gameRound).toBe(1);
            expect(gameStore.getState().gamePhase).toBe(GamePhase.WESTEROS1);
            expect(gameState.wildlingsCount).toBe(0);
            expect(gameState.currentPlayer.house).toBe(gameState.ironThroneSuccession[0]);
            expect(gameState.currentlyAllowedTokenTypes).toEqual(TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES);
        });
    });
});