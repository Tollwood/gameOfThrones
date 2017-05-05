import * as Assets from '../../assets';
import {TopMenuItem} from './topMenuItem';

const MENU = 'menu',
    OVERLAY = 'overlay';

export class MenuSupply extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Supply');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Supply', Assets.Images.ImagesSupply.getPNG());
        game.load.image(MENU + 'Supply', Assets.Images.ImagesMenuSupply.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

    hideMarker(overlay: Phaser.Sprite) {

    }
}