import {WesterosCard} from '../../cards/westerosCard';
import GameRules from './gameRules';


export default class WesterosCardRules {

    public static getNextCard(cardType: number): WesterosCard {
        let cards: WesterosCard[];
        switch (cardType) {
            case 1:
                cards = GameRules.gameState.westerosCards1;
                break;
            case 2:
                cards = GameRules.gameState.westerosCards2;
                break;
            case 3:
                cards = GameRules.gameState.westerosCards3;
                break;
        }

        return this.moveCardToEndOfTheStack(cards);
    }

    public static stillPlayingWesterosCard() {
        let gameState = GameRules.gameState;
        switch (gameState.currentWesterosCard.selectedFunction.functionName) {
            case 'recruit':
                let areasAllowedToRecruit = GameRules.gameState.areasAllowedToRecruit;
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