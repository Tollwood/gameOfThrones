import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';
import {convertHouseToNumber, House} from '../../../logic/board/house';
import VictoryRules from '../../../logic/board/gameRules/victoryRules';
import {gameStore} from '../../../logic/board/gameState/reducer';

const POSITION_X = [20, 100, 180, 260, 340, 420, 500];

export class MenuVictory extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, MenuVictory.name, topMenuRenderer);
        this.marker = game.add.group();
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + MenuVictory.name) {
            gameStore.getState().players.forEach((player) => {
                let marker = overlay.game.add.sprite(overlay.x - overlay.game.camera.x + this.getPositionForHouse(player.house), 120 + (convertHouseToNumber(player.house) * 45), House[player.house] + TopMenuRenderer.CASTLE, undefined, this.marker);
                marker.fixedToCamera = true;
            });
        }
    }

    private getPositionForHouse(house: House): number {
        let numOfCastlesAndStrongholds = VictoryRules.getVictoryPositionFor(gameStore.getState(), house);
        return POSITION_X[numOfCastlesAndStrongholds - 1];
    }
}