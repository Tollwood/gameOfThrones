import {ActionFactory, GameStoreState, House, PlayerSetup} from 'got-store';
import Modal from '../../../utils/modal';
import Renderer from '../../../utils/renderer';
import {Store} from 'redux';

export default class WinningModal extends Modal {

  constructor(store: Store<GameStoreState>, renderer: Renderer) {
    super(renderer);
    store.subscribe(() => {
      this.showModal(store);
    });
  }

  showModal(store: Store<GameStoreState>) {
    if (store.getState().winningHouse) {
      this.addText(House[store.getState().winningHouse] + ' won the game', -50, 0);
      this.addText('New Game', 50, 0, true, () => {
        const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
        store.dispatch(ActionFactory.newGame(playerSetup));
        this.close();
      });
      this.show();
    }
  }
}
