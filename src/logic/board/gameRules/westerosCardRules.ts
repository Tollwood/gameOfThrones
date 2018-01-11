import {WesterosCard} from '../../cards/westerosCard';
import {gameStore, GameStoreState} from '../gameState/reducer';
import {GamePhase} from '../gamePhase';
import {playWesterosCard} from '../gameState/actions';


export default class WesterosCardRules {

    public static getNextCard(state: GameStoreState): WesterosCard {
        let cards: WesterosCard[];
        switch (state.gamePhase) {
            case GamePhase.WESTEROS1:
                cards = state.westerosCards1;
                break;
            case GamePhase.WESTEROS2:
                cards = state.westerosCards2;
                break;
            case GamePhase.WESTEROS3:
                cards = state.westerosCards3;
                break;
        }

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