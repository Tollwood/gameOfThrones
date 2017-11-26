import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';
import {convertHouseToNumber, House} from '../../../logic/board/house';
import GameRules from '../../../logic/board/gameRules/gameRules';

const POSITION_X = [0, 35, 70, 105, 140, 175];

export class MenuSupply extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, TopMenuRenderer.SUPPLY, topMenuRenderer);
        this.marker = game.add.group();
    }

    renderMarker(overlay: Phaser.Sprite) {
        if (overlay.key === TopMenuRenderer.OVERLAY + TopMenuRenderer.SUPPLY) {
            GameRules.gameState.players.forEach((player) => {
                let marker = overlay.game.add.sprite(overlay.x - overlay.game.camera.x + this.getPositionForHouse(player.house), 160 + (convertHouseToNumber(player.house) * 45), House[player.house] + TopMenuRenderer.CASTLE, undefined, this.marker);
                marker.fixedToCamera = true;
            });
        }
    }

    private getPositionForHouse(house: House): number {
        let numOfSupplys = GameRules.gameState.currentlyAllowedSupply.get(house);
        if (numOfSupplys > 6) {
            numOfSupplys = 6;
        }
        return POSITION_X[numOfSupplys];
    }
}