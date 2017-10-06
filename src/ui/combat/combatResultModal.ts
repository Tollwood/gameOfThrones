import ModalRenderer from '../modals/modalFactory';
import {House} from '../../logic/house';
import CombatResult from './combatResult';
import GameRules from '../../logic/gameRules';
export default class CombatResultModal {

    public static showModal(game: Phaser.Game, combatResult: CombatResult, onCloseFn: Function) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'House ' + House[combatResult.attackingArea.controllingHouse] + ' attacked  ' + House[combatResult.defendingArea.controllingHouse], -50, 0);
        ModalRenderer.addText(modal, 'House ' + House[combatResult.winner] + ' won the fight', 0, 0);
        ModalRenderer.addText(modal, House[combatResult.looser] + ' lost ' + combatResult.lostUnits.length + ' unit(s) during the fight', 50, 0);
        ModalRenderer.addText(modal, 'Close', 100, 0, true, () => {
            GameRules.resolveFight(combatResult);
            onCloseFn();
            modal.visible = false;
            modal.destroy();
        });


        modal.visible = true;

    }

}