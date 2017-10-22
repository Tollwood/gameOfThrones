import {Area, AreaKey} from '../board/logic/area';
import Modal from '../utils/modal';
import GameRules from '../board/logic/gameRules';
import GamePhaseService from '../board/logic/gamePhaseService';
export default class EstablishControlModal extends Modal {

    constructor(game, sourceArea: Area, targetAreaKey: AreaKey) {
        super(game);
        this.addText('Establish Control over ' + sourceArea.key, -50);
        this.addText('Yes', 50, -100, true, () => {
            GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units, true, true);
            GamePhaseService.nextPlayer();
            this.close();
        });
        this.addText('No', 50, 100, true, () => {
            GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
            GamePhaseService.nextPlayer();
            this.close();
        });
    }
}