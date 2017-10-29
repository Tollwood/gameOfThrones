import {House} from '../../logic/board/house';
import GameRules from '../../logic/board/gameRules/gameRules';
import Modal from '../../utils/modal';
export default class WinningModal extends Modal {

    constructor(game: Phaser.Game, house: House) {
        super(game);
        this.addText(House[house] + ' won the game', -50, 0);
        this.addText('New Game', 50, 0, true, () => {
            GameRules.newGame();
            this.close();
        });
    }
}