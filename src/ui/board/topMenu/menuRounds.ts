import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';
import {gameStore} from '../../../logic/board/gameState/reducer';

const POSITION_X = [20, 63, 104, 145, 187, 229, 271, 312, 354, 396];

export class MenuRounds extends TopMenuItem {


    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, 'Rounds', topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + 'Rounds') {
            let marker = overlay.game.add.sprite(overlay.x - overlay.game.camera.x + this.getPositionForGameMarker(), 90, 'gameRoundMarker', undefined, this.marker);
            marker.fixedToCamera = true;
        }
    }

    private getPositionForGameMarker() {
        let currentRound = gameStore.getState().gameRound;
        return POSITION_X[currentRound - 1];
    }
}