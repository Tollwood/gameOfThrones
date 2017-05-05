import * as Assets from '../../assets';
import {TopMenuItem} from './topMenuItem';

const MENU = 'menu',
    OVERLAY = 'overlay';

export class MenuWildlings extends TopMenuItem {

    private gameRoundMarker: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Wildlings');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Wildlings', Assets.Images.ImagesWildlingStatus.getPNG());
        game.load.image(MENU + 'Wildlings', Assets.Images.ImagesMenuWildlings.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

    hideMarker(overlay: Phaser.Sprite) {

    }
}