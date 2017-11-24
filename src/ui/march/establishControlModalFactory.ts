import {Area} from '../../logic/board/area';
import Modal from '../../utils/modal';
import GamePhaseService from '../../logic/board/gamePhaseService';
import MovementRules from '../../logic/board/gameRules/movementRules';
import {AreaKey} from '../../logic/board/areaKey';
export default class EstablishControlModal extends Modal {

    constructor(game, sourceArea: Area, targetAreaKey: AreaKey) {
        super(game);
        this.addText('Establish Control over ' + sourceArea.key, -50);
        this.addText('Yes', 50, -100, true, () => {
            MovementRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units, true, true);
            GamePhaseService.nextPlayer();
            this.close();
        });
        this.addText('No', 50, 100, true, () => {
            MovementRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
            GamePhaseService.nextPlayer();
            this.close();
        });
    }
}