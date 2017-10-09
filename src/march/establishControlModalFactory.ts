import ModalRenderer from '../utils/modalFactory';
import {Area} from '../board/logic/area';
export default class EstablishControlModalFactory {

    static showModal(game, area: Area, yesFn: Function, noFn: Function) {
        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Establish Control over ' + area.key, -50);
        ModalRenderer.addText(modal, 'Yes', 50, -100, true, () => {
            yesFn();
            ModalRenderer.closeFn(modal);
        });
        ModalRenderer.addText(modal, 'No', 50, 100, true, () => {
            noFn();
            ModalRenderer.closeFn(modal);
        });
        ModalRenderer.displayModal(modal);
    }
}