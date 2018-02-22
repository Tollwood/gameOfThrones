import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {ActionFactory, GameStoreState, WesterosCard} from 'got-store';
import Modal from '../../../utils/modal';
import Renderer from '../../../utils/renderer';
import {Store} from 'redux';

export default class WesterosCardModal extends Modal {

  constructor(store: Store<GameStoreState>, renderer: Renderer, card: WesterosCard) {
        super(renderer, undefined, undefined, Phaser.Color.getColor(139, 69, 19));

        if (card.options.length > 1) {
            let nextTextY = 60;
            let textYIncrement = 30;
            card.options.forEach((cardFunction) => {
                let onOptionCloseFn = () => {
                    card.selectedFunction = cardFunction;
                  store.dispatch(ActionFactory.executeWesterosCard(card));
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
              store.dispatch(ActionFactory.executeWesterosCard(card));
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
