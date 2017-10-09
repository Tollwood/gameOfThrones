import {House} from '../logic/house';
import ModalRenderer from '../../utils/modalFactory';
import GameRules from '../logic/gameRules';
import Renderer from '../../utils/renderer';
export default class WinningModal {

    public static showWinningModal(game: Phaser.Game, house: House) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, House[house] + ' won the game', -50, 0);
        ModalRenderer.addText(modal, 'New Game', 50, 0, true, () => {
            GameRules.newGame();
            modal.visible = false;
            modal.destroy();
            Renderer.rerenderRequired = true;
        });

        modal.visible = true;

    }
}