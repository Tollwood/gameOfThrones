import {TopMenuItem} from './topMenuItem';
import GameState from '../../logic/gameStati';
import TopMenuRenderer from './topMenuRenderer';

const POSITION_X = [40, 80, 120, 150, 190, 230, 260, 300, 340, 370, 410, 450];

export class MenuWildlings extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, 'Wildlings', topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + 'Wildlings') {
            let wildlingsCount = GameState.getInstance().wildlingsCount;
            let marker = overlay.game.add.image(overlay.x - overlay.game.camera.x + POSITION_X[wildlingsCount], 80, 'gameRoundMarker', undefined, this.marker);
            marker.fixedToCamera = true;
        }
    }
}