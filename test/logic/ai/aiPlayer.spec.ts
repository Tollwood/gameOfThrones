import {GamePhase} from '../../../src/logic/board/gamePhase';
import AiPlayer from '../../../src/logic/ai/aiPlayer';
import {House} from '../../../src/logic/board/house';
import {gameStore} from '../../../src/logic/board/gameState/reducer';
import {loadGame} from '../../../src/logic/board/gameState/actions';

describe('AiPlayer', () => {

    it('should do nothing if not in planning Phase ', () => {

        // given
        const initialState = {
            gamePhase: GamePhase.WESTEROS1,
            areasAllowedToRecruit: []
        };
        const aiPlayer = new AiPlayer(House.stark, 5);
        // when
        gameStore.dispatch(loadGame(initialState));
        aiPlayer['placeOrderToken'](initialState);
        // then
        const newState = gameStore.getState();
        expect(newState).toEqual(initialState);

    });

    it('should place all token for eligible areas controlled by aiPlayer during planning Phase ', () => {

        // given
        const initialState = {
            gamePhase: GamePhase.WESTEROS1,
            areasAllowedToRecruit: []
        };
        const aiPlayer = new AiPlayer(House.stark, 5);
        // when
        gameStore.dispatch(loadGame(initialState));
        aiPlayer['placeOrderToken'](initialState);
        // then
        const newState = gameStore.getState();
        expect(newState).toEqual(initialState);

    });


    xit('should recruit uints if its the aiPlayers turn', () => {
        fail('not yet tested');
    });

    xit('should execute raid Order aiPlayer during planning Phase ', () => {
        fail('not yet tested');
    });
});