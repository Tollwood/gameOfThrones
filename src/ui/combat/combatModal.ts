import ModalRenderer from '../modals/modalFactory';
import {Area} from '../../logic/area';
import {House} from '../../logic/house';
import CombatResultModal from './combatResultModal';
import CombatCalculator from './combatCalculator';
export default class CombatModal {

    public static showModal(game: Phaser.Game, sourceArea: Area, targetArea: Area, onCloseFn: Function) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Attack ' + House[targetArea.controllingHouse] + ' in ' + targetArea.key, -50, 0);
        ModalRenderer.addText(modal, 'Follow my orders!', 50, -100, true, () => {
            let combatResult = CombatCalculator.calculateCombat(sourceArea, targetArea);
            CombatResultModal.showModal(game, combatResult, onCloseFn);
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