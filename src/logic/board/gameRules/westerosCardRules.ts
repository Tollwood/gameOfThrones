import {WesterosCard, WesterosCardState} from '../../cards/westerosCard';
import GamePhaseService from '../gamePhaseService';
import CardFactory from '../../cards/cardFactory';
import GameRules from './gameRules';


export default class WesterosCardRules {


    public static getWesterosCard(cardType: number) {
        let card = GameRules.gameState.currentWesterosCard;

        if (card == null) {
            card = this.playNewCard(cardType);
        }
        else if (card !== null && card.state === WesterosCardState.executeCard) {
            if (this.stillPlayingWesterosCard()) {
                return card;
            }
            else {
                GamePhaseService.switchToNextPhase();
                GameRules.gameState.currentWesterosCard = null;
                card.state = WesterosCardState.played;
                return card;
            }
        }
        GameRules.gameState.currentWesterosCard = card;
        return card;
    }

    private static playNewCard(cardType: number): WesterosCard {

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

        let card = CardFactory.playNextCard(cards);
        GameRules.gameState.currentWesterosCard = card;
        return card;
    }

    private static stillPlayingWesterosCard() {
        let gameState = GameRules.gameState;
        switch (gameState.currentWesterosCard.selectedFunction.functionName) {
            case 'recruit':
                let areasAllowedToRecruit = GameRules.gameState.areasAllowedToRecruit;
                return areasAllowedToRecruit.length > 0;
            default:
                return false;
        }
    }

}