import {TopMenuItem} from './topMenuItem';
import TopMenuRenderer from './topMenuRenderer';


export class MenuInvluence extends TopMenuItem {

    constructor(game: Phaser.Game, x: number, y: number, topMenuRenderer: TopMenuRenderer) {
        super(game, x, y, TopMenuRenderer.INFLUENCE, topMenuRenderer);
    }

    renderMarker(overlay: Phaser.Sprite) {

    }

}