import {Area} from '../../board/logic/area';
import ModalRenderer from '../../utils/modalFactory';
export default class MusteringModal {

    public static showModal(game: Phaser.Game, area: Area) {
        let modal = ModalRenderer.createModal(game);
        let musteringPoints = 2;
        ModalRenderer.addText(modal, 'mustering points left' + musteringPoints, -100, 0, true);
        ModalRenderer.addText(modal, 'skip mustering for this area', 100, 0, true, () => {
            ModalRenderer.closeFn(modal);
        });
        this.newUnits(game);
        ModalRenderer.displayModal(modal);
    }

    private static newUnits(game: Phaser.Game) {

    }
}