import ModalRenderer from '../../ui/modals/modalFactory';
import {WesterosCard} from '../logic/westerosCard';
import GameRules from '../../logic/gameRules';
export default class WesterosCardModal {

    static showModal(game: Phaser.Game, card: WesterosCard, onCloseFn: Function) {

        let modal = ModalRenderer.createModal(game);
        let closeFn = () => {
            onCloseFn();
            GameRules.increaseWildlings(card.wildling);
            modal.visible = false;
            modal.destroy();
        };

        ModalRenderer.addText(modal, card.title, -100, 0, true, closeFn);
        ModalRenderer.addClickableImage(modal, card.artwork, 0, 0, closeFn);
        ModalRenderer.addText(modal, card.description, 100, 0, true, closeFn);
        if (card.wildling > 0) {
            ModalRenderer.addClickableImage(modal, 'wildlingsSymbol', -40, 130, closeFn);
        }
        ModalRenderer.addClickableImage(modal, 'westeros' + card.cardType, 25, 135, closeFn);
        game.world.bringToTop(modal);
        modal.visible = true;
    }
}