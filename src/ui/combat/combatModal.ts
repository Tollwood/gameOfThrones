import ModalRenderer from '../modals/modalFactory';
import {Area} from '../../logic/area';
import {House} from '../../logic/house';
import CombatResultModal from './combatResultModal';
import CombatCalculator from './combatCalculator';
import Card from '../../cards/card';
import {CardExecutionPoint} from '../../cards/cardExecutionPoint';
export default class CombatModal {

    public static showModal(game: Phaser.Game, sourceArea: Area, targetArea: Area, onCloseFn: Function) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'Attack ' + House[targetArea.controllingHouse] + ' in ' + targetArea.key, -50, 0);
        ModalRenderer.addText(modal, 'Follow my orders!', 50, -100, true, () => {
            let attackersCard = new Card('SomeOne', null, 0, 0, 0, 'double Defense Token', 'doubleDefenseToken', House.stark, CardExecutionPoint.beforeFight);
            let defendersCard = new Card('SomeOne', null, 0, 0, 0, 'get all cards back', 'getAllCardsBack', House.stark, CardExecutionPoint.afterFight);
            let combatResult = CombatCalculator.calculateCombat(sourceArea, targetArea, attackersCard, defendersCard);
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