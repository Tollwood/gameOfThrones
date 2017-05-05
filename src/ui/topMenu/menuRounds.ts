import * as Assets from '../../assets';
import {TopMenuItem} from './topMenuItem';
import GameState from '../../logic/gameStati';

const MENU = 'menu',
    OVERLAY = 'overlay',
    POSITION_X = [20, 63, 104, 145, 187, 229, 271, 312, 354, 396];

export class MenuRounds extends TopMenuItem {

    private gameRoundMarker: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Rounds');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Rounds', Assets.Images.ImagesGamerounds.getPNG());
        game.load.image(MENU + 'Rounds', Assets.Images.ImagesMenuRounds.getPNG());
        game.load.image('gameRoundMarker', Assets.Images.ImagesGameRoundMarker.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === OVERLAY + 'Rounds') {
            this.gameRoundMarker = overlay.game.add.sprite(overlay.x + this.getPositionForGameMarker(), overlay.y + 45, 'gameRoundMarker');
        }
    }

    hideMarker(overlay: Phaser.Sprite) {
        if (overlay.key === OVERLAY + 'Rounds' && this.gameRoundMarker) {
            this.gameRoundMarker.destroy();
        }
    }

    private getPositionForGameMarker() {
        let currentRound = GameState.getInstance().round;
        return POSITION_X[currentRound - 1];
    }
}