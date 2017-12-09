import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';


export class MenuInvluence extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, MenuInvluence.name, topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

}