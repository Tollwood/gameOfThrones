import {TopMenuItem} from './topMenuItem';

import TopMenuRenderer from './topMenuRenderer';
import {gameStore} from '../../../logic/board/gameState/reducer';
import Image = Phaser.Image;

const POSITION_X = [40, 80, 120, 150, 190, 230, 260, 300, 340, 370, 410, 450];

export class MenuWildlings extends TopMenuItem {
    private wildlingMarker: Phaser.Image;
    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, 'Wildlings', topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + 'Wildlings') {
            let wildlingsCount = gameStore.getState().wildlingsCount;
            this.wildlingMarker = this.overlay.game.add.image(0, 80, 'gameRoundMarker', undefined, this.marker);
            this.updateXPosition(wildlingsCount);
            this.wildlingMarker.fixedToCamera = true;

        }
    }

    updateXPosition(wildlingsCount: number) {
        this.wildlingMarker.x = this.overlay.x - this.overlay.game.camera.x + POSITION_X[wildlingsCount];
    }
}