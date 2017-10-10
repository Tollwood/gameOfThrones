import * as Assets from '../../../assets';
import {TopMenuItem} from './topMenuItem';
import GameState from '../../logic/gameStati';
import {House} from '../../logic/house';
import GameRules from '../../logic/gameRules';

const MENU = 'menu',
    OVERLAY = 'overlay',
    POSITION_X = [0, 35, 70, 105, 140, 175];

export class MenuSupply extends TopMenuItem {
    private marker: Phaser.Group;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'Supply');
        this.marker = game.add.group();
    }

    public static loadAssets(game: Phaser.Game) {
        game.load.image(OVERLAY + 'Supply', Assets.Images.ImagesTopMenuSupplySupply.getPNG());
        game.load.image(MENU + 'Supply', Assets.Images.ImagesTopMenuMenuSupply.getPNG());
    }

    renderMarker(overlay: Phaser.Sprite) {

        if (overlay.key === OVERLAY + 'Supply') {
            GameState.getInstance().players.forEach((player) => {
                let marker = overlay.game.add.sprite(overlay.x + this.getPositionForHouse(player.house), overlay.y + 100 + (player.house * 45), House[player.house] + 'Castle', undefined, this.marker);
                marker.fixedToCamera = true;
            });
        }
    }

    hideMarker(overlay: Phaser.Sprite) {
        this.marker.removeChildren();
    }

    private getPositionForHouse(house: House): number {
        let numOfSupplys = GameRules.getNumberOfSupply(house);
        if (numOfSupplys > 6) {
            numOfSupplys = 6;
        }
        return POSITION_X[numOfSupplys];
    }
}