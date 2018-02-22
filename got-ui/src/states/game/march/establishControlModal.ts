import {ActionFactory, Area, AreaKey, GameStoreState} from 'got-store';
import Modal from '../../../utils/modal';
import {Store} from 'redux';

export default class EstablishControlModal extends Modal {
    private _closeFn: Function;

  constructor(store: Store<GameStoreState>, renderer, sourceArea: Area, targetAreaKey: AreaKey, closeFn: Function) {
        super(renderer);
        this._closeFn = closeFn;
        this.addText('Establish Control over ' + sourceArea.key, -50);
        this.addText('Yes', 50, -100, true, () => {
          store.dispatch(ActionFactory.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units, true, true));
            this.close();
        });
        this.addText('No', 50, 100, true, () => {
          store.dispatch(ActionFactory.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units));
            this.close();
        });
    }

    close() {
        super.close();
        this._closeFn();
    }
}
