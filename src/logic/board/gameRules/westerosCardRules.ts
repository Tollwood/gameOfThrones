import {WesterosCard} from '../../cards/westerosCard';
import {gameStore} from '../gameState/reducer';
import {playWesterosCard} from '../gameState/actions';
import {GameStoreState} from '../gameState/gameStoreState';


export default class WesterosCardRules {

    public static getNextCard(state: GameStoreState): WesterosCard {
        const cards: WesterosCard[] = state.westerosCards.get(state.gamePhase);
        const cardToPlay = this.moveCardToEndOfTheStack(cards);
        gameStore.dispatch(playWesterosCard(cardToPlay));
        return cardToPlay;
    }

    public static moveCardToEndOfTheStack(westerosCards: Array<WesterosCard>): WesterosCard {
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        return cardToPlay;
    }
}