import {House} from '../../logic/board/house';
import Modal from '../../utils/modal';
import {gameStore, GameStoreState} from '../../logic/board/gameState/reducer';
import {newGame} from '../../logic/board/gameState/actions';
import PlayerSetup from '../../logic/board/playerSetup';
export default class WinningModal extends Modal {

    constructor(game: Phaser.Game) {
        super(game);
        gameStore.subscribe(() => {
            this.showModal(gameStore.getState());
        });
    }

    showModal(state: GameStoreState) {
        if (state.winningHouse) {
            this.addText(House[state.winningHouse] + ' won the game', -50, 0);
            this.addText('New Game', 50, 0, true, () => {
                const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
                gameStore.dispatch(newGame(playerSetup));
                this.close();
            });
            this.show();
        }
    }
}