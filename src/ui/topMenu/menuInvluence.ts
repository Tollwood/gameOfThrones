import * as Assets from '../../assets';
import {TopMenuItem} from './topMenuItem';

const MENU = 'menu',
    OVERLAY = 'overlay';

export class MenuInvluence extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Invluence');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Invluence', Assets.Images.ImagesTopMenuInfluenceInfluence.getPNG());
        game.load.image(MENU + 'Invluence', Assets.Images.ImagesTopMenuMenuInvluence.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

    hideMarker(overlay: Phaser.Sprite) {

    }
}