import Renderer from '../../../utils/renderer';
import {GameStoreState} from 'got-store';
import {Store} from 'redux';
import WesterosCardModal from './westerosCardModal';

export class WesterosCardRenderer {
    private renderer: Renderer;

  init(store: Store<GameStoreState>, renderer: Renderer) {
        this.renderer = renderer;
    store.subscribe(() => {
      this.renderWesterosCard(store);
        });
    }

  private renderWesterosCard(store: Store<GameStoreState>,) {
    if (store.getState().currentWesterosCard !== null) {
      let modal = new WesterosCardModal(store, this.renderer, store.getState().currentWesterosCard);
            modal.show();
        }
    }
}
