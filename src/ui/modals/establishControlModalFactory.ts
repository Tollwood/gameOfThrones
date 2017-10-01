import ModalRenderer from './modalFactory';
import {Area} from '../../logic/area';
export class EstablishControlModalFactory {

    static showModal(game, area: Area, yesFn: Function, noFn: Function) {
        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Establish Control over ' + area.key, -50);
        ModalRenderer.addText(modal, 'Yes', 50, -100, true, () => {
            yesFn();
            modal.visible = false;
            modal.destroy();
        });
        ModalRenderer.addText(modal, 'No', 50, 100, true, () => {
            noFn();
            modal.visible = false;
            modal.destroy();
        });
        game.world.bringToTop(modal);
        modal.visible = true;
    }
}