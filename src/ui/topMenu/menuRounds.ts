import * as Assets from "../../assets";
import {topMenuItem} from "./topMenuItem";

const MENU = 'menu',
    OVERLAY = 'overlay';

export class menuRounds extends topMenuItem {

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
            this.gameRoundMarker = overlay.game.add.sprite(overlay.x + 20, overlay.y + 45, 'gameRoundMarker');
        }
    }

    hideMarker(overlay: Phaser.Sprite) {
        if (overlay.key === OVERLAY + 'Rounds' && this.gameRoundMarker) {
            this.gameRoundMarker.destroy()
        }
    }
}