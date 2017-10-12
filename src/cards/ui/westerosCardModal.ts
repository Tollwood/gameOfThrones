import ModalRenderer from '../../utils/modalFactory';
import {WesterosCard, WesterosCardState} from '../logic/westerosCard';
import GameRules from '../../board/logic/gameRules';
import CardAbilities from '../logic/cardAbilities';
export default class WesterosCardModal {

    static showModal(game: Phaser.Game, card: WesterosCard) {
        let modal;

        let closeFn = () => {
            GameRules.increaseWildlings(card.wildling);
            ModalRenderer.closeFn(modal);
        };
        if (card.options.length > 1) {
            modal = ModalRenderer.createModal(game, undefined, undefined, Phaser.Color.getColor(139, 69, 19));
            let nextTextY = 60;
            let textYIncrement = 30;
            card.options.forEach((cardFunction) => {
                let onOptionCloseFn = () => {
                    CardAbilities[cardFunction.functionName](card);
                    card.state = WesterosCardState.executeCard;
                    card.selectedFunction = cardFunction;
                    closeFn();
                };
                ModalRenderer.addText(modal, cardFunction.description, nextTextY, 0, true, onOptionCloseFn, '18px', 'left');
                nextTextY += textYIncrement;
            });
            ModalRenderer.addText(modal, card.title, -130, 0, true);
            ModalRenderer.addImage(modal, card.artwork, -55, 0);
            ModalRenderer.addText(modal, card.description, 20, 0, true, undefined, '18px');

            if (card.wildling > 0) {
                ModalRenderer.addImage(modal, 'wildlingsSymbol', -90, 130);
            }
            ModalRenderer.addImage(modal, 'westeros' + card.cardType, -30, 135);
        } else {
            let onCloseFn = () => {
                CardAbilities[card.options[0].functionName](card);
                card.state = WesterosCardState.executeCard;
                card.selectedFunction = card.options[0];
                closeFn();
            };
            modal = ModalRenderer.createModal(game, undefined, 200, Phaser.Color.getColor(139, 69, 19));
            ModalRenderer.addText(modal, card.title, -80, 0, true);
            ModalRenderer.addImage(modal, card.artwork, -5, 0);
            ModalRenderer.addText(modal, card.description, 70, 0, true, undefined, '18px');
            if (card.wildling > 0) {
                ModalRenderer.addImage(modal, 'wildlingsSymbol', -40, 130);
            }
            ModalRenderer.addImage(modal, 'westeros' + card.cardType, 20, 135);
            ModalRenderer.closeOnModalClick(modal, 600, 200, onCloseFn);
        }


        ModalRenderer.displayModal(modal);
    }
}