import {TopMenuItem} from './topMenuItem';
import GameState from '../../logic/gameStati';
import {House} from '../../logic/house';
import GameRules from '../../logic/gameRules';
import TopMenuRenderer from './topMenuRenderer';

const POSITION_X = [0, 35, 70, 105, 140, 175];

export class MenuSupply extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, TopMenuRenderer.SUPPLY, topMenuRenderer);
        this.marker = game.add.group();
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + TopMenuRenderer.SUPPLY) {
            GameState.getInstance().players.forEach((player) => {
                let marker = overlay.game.add.sprite(overlay.x + this.getPositionForHouse(player.house), 160 + (player.house * 45), House[player.house] + TopMenuRenderer.CASTLE, undefined, this.marker);
                marker.fixedToCamera = true;
            });
        }
    }

    private getPositionForHouse(house: House): number {
        let numOfSupplys = GameRules.getNumberOfSupply(house);
        if (numOfSupplys > 6) {
            numOfSupplys = 6;
        }
        return POSITION_X[numOfSupplys];
    }
}