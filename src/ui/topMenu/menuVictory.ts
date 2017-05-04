import * as Assets from "../../assets";
import {TopMenuItem} from "./topMenuItem";

const MENU = 'menu',
    OVERLAY = 'overlay';

export class MenuVictory extends TopMenuItem {


    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Victory');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Victory', Assets.Images.ImagesVictory.getPNG());
        game.load.image(MENU + 'Victory', Assets.Images.ImagesMenuVictory.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

    hideMarker(overlay: Phaser.Sprite) {

    }
}