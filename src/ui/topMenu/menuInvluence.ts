import * as Assets from "../../assets";
import {topMenuItem} from "./topMenuItem";

const MENU = 'menu',
    OVERLAY = 'overlay';

export class menuInvluence extends topMenuItem {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Invluence');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Invluence', Assets.Images.ImagesInfluence.getPNG());
        game.load.image(MENU + 'Invluence', Assets.Images.ImagesMenuInvluence.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

    hideMarker(overlay: Phaser.Sprite) {

    }
}