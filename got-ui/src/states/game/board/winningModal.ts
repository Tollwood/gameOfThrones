import {ActionFactory, GameLogic, House, PlayerSetup} from 'got-store';
import Modal from '../../../utils/modal';
import Renderer from '../../../utils/renderer';

export default class WinningModal extends Modal {

  constructor(gameLogic: GameLogic, renderer: Renderer) {
    super(renderer);
    gameLogic.subscribe(() => {
      this.showModal(gameLogic);
    });
  }

  showModal(gameLogic: GameLogic) {
    if (gameLogic.getState().winningHouse) {
      this.addText(House[gameLogic.getState().winningHouse] + ' won the game', -50, 0);
      this.addText('New Game', 50, 0, true, () => {
        const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
        gameLogic.execute(ActionFactory.newGame(playerSetup));
        this.close();
      });
      this.show();
    }
  }
}
