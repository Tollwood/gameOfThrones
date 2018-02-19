import {Area} from '../../logic/board/area';
import Modal from '../../utils/modal';
import {AreaKey} from '../../logic/board/areaKey';
import {gameStore} from '../../logic/board/gameState/reducer';
import {moveUnits} from '../../logic/board/gameState/actions';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export default class EstablishControlModal extends Modal {
    private _closeFn: Function;

    constructor(renderer, sourceArea: Area, targetAreaKey: AreaKey, closeFn: Function) {
        super(renderer);
        this._closeFn = closeFn;
        this.addText('Establish Control over ' + sourceArea.key, -50);
        this.addText('Yes', 50, -100, true, () => {
            gameStore.dispatch(moveUnits(sourceArea.key, targetAreaKey, sourceArea.units, true, true));
            this.close();
        });
        this.addText('No', 50, 100, true, () => {
            gameStore.dispatch(moveUnits(sourceArea.key, targetAreaKey, sourceArea.units));
            this.close();
        });
    }

    close() {
        super.close();
        this._closeFn();
    }
}
