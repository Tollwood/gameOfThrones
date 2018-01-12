import {WesterosCard} from '../../logic/cards/westerosCard';
import Modal from '../../utils/modal';
import {gameStore} from '../../logic/board/gameState/reducer';
import {executeWesterosCard} from '../../logic/board/gameState/actions';
import Renderer from '../../utils/renderer';

export default class WesterosCardModal extends Modal {

    constructor(renderer: Renderer, card: WesterosCard) {
        super(renderer, undefined, undefined, Phaser.Color.getColor(139, 69, 19));

        if (card.options.length > 1) {
            let nextTextY = 60;
            let textYIncrement = 30;
            card.options.forEach((cardFunction) => {
                let onOptionCloseFn = () => {
                    card.selectedFunction = cardFunction;
                    gameStore.dispatch(executeWesterosCard(card));
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
            this.addImage(card.gamePhase, -30, 135);
        } else {
            let onCloseFn = () => {
                card.selectedFunction = card.options[0];
                gameStore.dispatch(executeWesterosCard(card));
                this.close();
            };
            this._height = 200;
            this.addText(card.title, -80, 0, true);
            this.addImage(card.artwork, -5, 0);
            this.addText(card.description, 70, 0, true, undefined, '18px');
            if (card.wildling > 0) {
                this.addImage('wildlingsSymbol', -40, 130);
            }
            this.addImage(card.gamePhase, 20, 135);
            this.closeOnModalClick(onCloseFn);
        }

    }
}