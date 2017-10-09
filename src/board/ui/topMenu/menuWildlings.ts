import * as Assets from '../../../assets';
import {TopMenuItem} from './topMenuItem';
import GameState from '../../logic/gameStati';

const MENU = 'menu',
    OVERLAY = 'overlay',
    POSITION_X = [40, 80, 120, 150, 190, 230, 260, 300, 340, 370, 410, 450];

export class MenuWildlings extends TopMenuItem {

    private marker: Phaser.Image;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Wildlings');
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Wildlings', Assets.Images.ImagesTopMenuWildlingstatusWildlingStatus.getPNG());
        game.load.image(MENU + 'Wildlings', Assets.Images.ImagesTopMenuMenuWildlings.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === OVERLAY + 'Wildlings') {
            let wildlingsCount = GameState.getInstance().wildlingsCount;
            this.marker = overlay.game.add.image(overlay.x + POSITION_X[wildlingsCount], overlay.y + 45, 'gameRoundMarker');
            this.marker.fixedToCamera = true;
        }
    }

    hideMarker(overlay: Phaser.Sprite) {
        this.marker.destroy();
    }
}