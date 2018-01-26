import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {executeWesterosCard, loadGame} from '../../../../src/logic/board/gameState/actions';
import {GamePhase} from '../../../../src/logic/board/gamePhase';
import CardAbilities from '../../../../src/logic/cards/cardAbilities';
import {WesterosCard} from '../../../../src/logic/cards/westerosCard';
import WesterosCardBuilder from '../../../westerosCardBuilder';
import CardFunction from '../../../../src/logic/cards/cardFuncttion';
import {GameStoreState} from '../../../../src/logic/board/gameState/gameStoreState';


describe('executeWesterosCardAction', () => {

    it('should increase wildlingCount', () => {
        // given
        const currentWildingCount: number = 3;
        const card: WesterosCard = new WesterosCardBuilder()
            .gamePhase(GamePhase.WESTEROS1)
            .selectedFunction(new CardFunction('shuffleCards', 'description'))
            .wildling(4)
            .build();

        const state: GameStoreState = {wildlingsCount: currentWildingCount};

        gameStore.dispatch(loadGame(state));

        spyOn(CardAbilities, 'shuffleCards').and.returnValue(state);

        // when
        gameStore.dispatch(executeWesterosCard(card));

        // then
        const newState = gameStore.getState();

        expect(newState.wildlingsCount).toBe(currentWildingCount + card.wildling);
        expect(CardAbilities.shuffleCards).toHaveBeenCalledWith(state);
    });

});

