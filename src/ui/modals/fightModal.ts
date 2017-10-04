import ModalRenderer from './modalFactory';
import {Area} from '../../logic/area';
import {House} from '../../logic/house';
export default class FightModal {

    public static showModal(game: Phaser.Game, sourceArea: Area, targetArea: Area) {

        let modal = ModalRenderer.createModal(game);
        let attackText = ModalRenderer.addText(modal, 'Attack ' + House[targetArea.controllingHouse] + ' in ' + targetArea.key, -50, 0);
        ModalRenderer.addText(modal, 'Follow my orders!', 50, -100, true, () => {
            //let combatResult = GameRules.calculateCombat(sourceArea, targetArea);
            modal.visible = false;
            modal.destroy();
        });

        ModalRenderer.addText(modal, 'No fight today', 50, 100, true, () => {
            modal.visible = false;
            modal.destroy();
        });

        modal.visible = true;

    }

}