import {WesterosCard, WesterosCardState} from '../../logic/cards/westerosCard';
import CardAbilities from '../../logic/cards/cardAbilities';
import Modal from '../../utils/modal';
import WildlingRules from '../../logic/board/gameRules/wildlingRules';
export default class WesterosCardModal extends Modal {

    constructor(game: Phaser.Game, card: WesterosCard) {
        super(game, undefined, undefined, Phaser.Color.getColor(139, 69, 19));

        if (card.options.length > 1) {
            let nextTextY = 60;
            let textYIncrement = 30;
            card.options.forEach((cardFunction) => {
                let onOptionCloseFn = () => {
                    CardAbilities[cardFunction.functionName](card);
                    card.state = WesterosCardState.executeCard;
                    card.selectedFunction = cardFunction;
                    WildlingRules.increaseWildlings(card.wildling);
                    this.close();
                };
                this.addText(cardFunction.description, nextTextY, 0, true, onOptionCloseFn, '18px', 'left');
                nextTextY += textYIncrement;
            });
            this.addText(card.title, -130, 0, true);
            this.addImage(card.artwork, -55, 0);
            this.addText(card.description, 20, 0, true, undefined, '18px');

            if (card.wildling > 0) {
                this.addImage('wildlingsSymbol', -90, 130);
            }
            this.addImage('westeros' + card.cardType, -30, 135);
        } else {
            let onCloseFn = () => {
                CardAbilities[card.options[0].functionName](card);
                card.state = WesterosCardState.executeCard;
                card.selectedFunction = card.options[0];
                WildlingRules.increaseWildlings(card.wildling);
                this.close();
            };
            this._height = 200;
            this.addText(card.title, -80, 0, true);
            this.addImage(card.artwork, -5, 0);
            this.addText(card.description, 70, 0, true, undefined, '18px');
            if (card.wildling > 0) {
                this.addImage('wildlingsSymbol', -40, 130);
            }
            this.addImage('westeros' + card.cardType, 20, 135);
            this.closeOnModalClick(onCloseFn);
        }

    }
}