import ModalRenderer from '../modals/modalFactory';
import {House} from '../../logic/house';
import CombatResult from './combatResult';
import GameRules from '../../logic/gameRules';
export default class CombatResultModal {

    public static showModal(game: Phaser.Game, fightResult: CombatResult, onCloseFn: Function) {

        let modal = ModalRenderer.createModal(game);
        ModalRenderer.addText(modal, 'House ' + House[fightResult.attackingArea.controllingHouse] + ' attacked  ' + House[fightResult.defendingArea.controllingHouse], -50, 0);
        ModalRenderer.addText(modal, 'House ' + House[fightResult.winner] + ' won the fight', 0, 0);
        ModalRenderer.addText(modal, House[fightResult.looser] + ' lost ' + fightResult.lostUnits.length + ' unit(s) during the fight', 50, 0);
        ModalRenderer.addText(modal, 'Close', 100, 0, true, () => {
            GameRules.resolveFight(fightResult);
            onCloseFn();
            modal.visible = false;
            modal.destroy();
        });


        modal.visible = true;

    }

}