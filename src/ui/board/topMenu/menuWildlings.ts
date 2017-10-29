import {TopMenuItem} from './topMenuItem';

import TopMenuRenderer from './topMenuRenderer';
import GameRules from '../../../logic/board/gameRules/gameRules';

const POSITION_X = [40, 80, 120, 150, 190, 230, 260, 300, 340, 370, 410, 450];

export class MenuWildlings extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, 'Wildlings', topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + 'Wildlings') {
            let wildlingsCount = GameRules.gameState.wildlingsCount;
            let marker = overlay.game.add.image(overlay.x - overlay.game.camera.x + POSITION_X[wildlingsCount], 80, 'gameRoundMarker', undefined, this.marker);
            marker.fixedToCamera = true;
        }
    }
}