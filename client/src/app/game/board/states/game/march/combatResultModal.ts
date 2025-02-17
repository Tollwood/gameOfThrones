import {CombatResult, House,} from 'got-store';
import Modal from '../../../utils/modal';
import Renderer from '../../../utils/renderer';

export default class CombatResultModal extends Modal {

    constructor(renderer: Renderer, combatResult: CombatResult, onCloseFn: Function) {
        super(renderer);
        this.addText('House ' + House[combatResult.attackingArea.controllingHouse] + ' attacked  ' + House[combatResult.defendingArea.controllingHouse], -50, 0);
        this.addText('House ' + House[combatResult.winner] + ' won the fight', 0, 0);
        this.addText(House[combatResult.looser] + ' lost ' + combatResult.lostUnits.length + ' unit(s) during the fight', 50, 0);
        this.addText('Close', 100, 0, true, () => {

          onCloseFn();
            this.close();
        });
    }

}
