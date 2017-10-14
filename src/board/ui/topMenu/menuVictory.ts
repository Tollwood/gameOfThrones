import {TopMenuItem} from './topMenuItem';
import {House} from '../../logic/house';
import GameRules from '../../logic/gameRules';
import GameState from '../../logic/gameStati';
import TopMenuRenderer from './topMenuRenderer';

const POSITION_X = [20, 100, 180, 260, 340, 420, 500];

export class MenuVictory extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, TopMenuRenderer.VICTORY, topMenuRenderer);
        this.marker = game.add.group();
    }



    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + TopMenuRenderer.VICTORY) {
            GameState.getInstance().players.forEach((player) => {
                let marker = overlay.game.add.sprite(overlay.x + this.getPositionForHouse(player.house), 120 + (player.house * 45), House[player.house] + TopMenuRenderer.CASTLE, undefined, this.marker);
                marker.fixedToCamera = true;
            });
        }
    }

    private getPositionForHouse(house: House): number {
        let numOfCastlesAndStrongholds = GameRules.getVictoryPositionFor(house);
        return POSITION_X[numOfCastlesAndStrongholds - 1];
    }
}