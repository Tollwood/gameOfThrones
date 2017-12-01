import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';
import {gameStore} from '../../../logic/board/gameState/reducer';

const POSITION_X = [20, 63, 104, 145, 187, 229, 271, 312, 354, 396];

export class MenuRounds extends TopMenuItem {

    private roundMarker: Phaser.Image;

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, 'Rounds', topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + 'Rounds') {
            this.roundMarker = overlay.game.add.sprite(0, 90, 'gameRoundMarker', undefined, this.marker);
            this.updatePosition(gameStore.getState().gameRound);
            this.roundMarker.fixedToCamera = true;
        }
    }

    private updatePosition(currentRound: number) {
        this.roundMarker.x = this.overlay.x - this.overlay.game.camera.x + POSITION_X[currentRound - 1];
    }
}