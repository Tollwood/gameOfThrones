import ModalRenderer from './modalFactory';
import Renderer from '../renderer';
import GameState from '../../logic/gameStati';
import {GamePhase} from '../../logic/gamePhase';
export default class OrderNotAllowedModal {

    public static showModal(game: Phaser.Game) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'This order is not allowed during the current game phase ' + GamePhase[GameState.getInstance().gamePhase], 0, 0, true, () => {
            modal.visible = false;
            modal.destroy();
            Renderer.rerenderRequired = true;
        });

        modal.visible = true;

    }
}