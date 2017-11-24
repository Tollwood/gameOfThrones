import {Area} from '../../logic/board/area';
import {House} from '../../logic/board/house';
import CombatResultModal from './combatResultModal';
import CombatCalculator from '../../logic/march/combatCalculator';
import Modal from '../../utils/modal';
export default class CombatModal extends Modal {

    constructor(game: Phaser.Game, sourceArea: Area, targetArea: Area, onCloseFn: Function) {
        super(game);
        this.addText('Attack ' + House[targetArea.controllingHouse] + ' in ' + targetArea.key, -50, 0);
        this.addText('Follow my orders!', 50, -100, true, () => {
            let combatResult = CombatCalculator.calculateCombat(sourceArea, targetArea);
            let modal = new CombatResultModal(game, combatResult, onCloseFn);
            modal.show();
            this.close();
        });

        this.addText('No fight today', 50, 100, true, () => {
            this.close();
        });
    }

}