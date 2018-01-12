import {WesterosCard} from '../../cards/westerosCard';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {playWesterosCard} from '../gameState/actions';


export default class WesterosCardRules {

    public static getNextCard(state: GameStoreState): WesterosCard {
        const cards: WesterosCard[] = state.westerosCards.get(state.gamePhase);
        const cardToPlay = this.moveCardToEndOfTheStack(cards);
        gameStore.dispatch(playWesterosCard(cardToPlay));
        return cardToPlay;
    }

    public static stillPlayingWesterosCard() {
        const gameState = gameStore.getState();
        switch (gameState.currentWesterosCard.selectedFunction.functionName) {
            case 'recruit':
                let areasAllowedToRecruit = gameStore.getState().areasAllowedToRecruit;
                return areasAllowedToRecruit.length > 0;
            default:
                return false;
        }
    }

    public static moveCardToEndOfTheStack(westerosCards: Array<WesterosCard>): WesterosCard {
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        return cardToPlay;
    }
}