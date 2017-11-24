import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {GamePhase, WESTEROS_PHASES} from '../../../../src/logic/board/gamePhase';
import TokenPlacementRules from '../../../../src/logic/board/gameRules/tokenPlacementRules';
describe('GameRules', ()=>{
    describe('newGame', ()=>{
        it('should initiziale a Game with 6 players', ()=>{

            GameRules.newGame();
            const gameState = GameRules.save();

            expect(gameState.round).toBe(1);
            expect(gameState.gamePhase).toBe(GamePhase.WESTEROS1);
            expect(gameState.wildlingsCount).toBe(0);
            expect(gameState.currentPlayer.house).toBe(gameState.ironThroneSuccession[0]);
            expect(gameState.currentlyAllowedTokenTypes).toEqual(TokenPlacementRules.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES);
        });
    });
});