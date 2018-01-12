import {TopMenuItem} from './topMenuItem';
import {MenuRounds} from './menuRounds';
import {MenuWildlings} from './menuWildlings';
import {MenuSupply} from './menuSupply';
import {MenuInvluence} from './menuInvluence';
import {MenuVictory} from './menuVictory';
import {GamePhase} from '../../../logic/board/gamePhase';

import {gameStore} from '../../../logic/board/gameState/reducer';

const MENU = 'menu',
    MENU_ITEMS = [MenuRounds, MenuWildlings, MenuSupply, MenuInvluence, MenuVictory];
export default class TopMenuRenderer {
    private menu: Array<TopMenuItem> = new Array();
    private currentPhase: Phaser.Text;

    public static OVERLAY = 'overlay';
    public static CASTLE = 'Castle';

    constructor(game: Phaser.Game) {
        this.currentPhase = this.addGamePhase(game);
        gameStore.subscribe(this.updateGamePhase.bind(this));
    }

    public renderTopMenu(game: Phaser.Game) {
        this.menu.map((menuItem: TopMenuItem) => {
            menuItem.getOverlay().destroy();
            menuItem.destroy();
        });
        let totalWidth: number = MENU_ITEMS
            .map((menuItem) => {
                return game.cache.getImage(menuItem.name).width;
            })
            .reduce((acc, val) => {
                return acc + val;
            }, 0);
        let nextX = (window.innerWidth - totalWidth) / 2;
        this.menu = MENU_ITEMS.map((menuItem): TopMenuItem => {
            const item = new menuItem(game, nextX, 0, this);
            game.world.add(item);
            nextX += item.width;
            return item;
        });
    }

    public hideOverlayIfNotClicked(): void {
        this.menu.map((menuItem) => {
            menuItem.tween(menuItem.getOverlay(), 0);
            menuItem.marker.removeChildren();
        });
    }

    private addGamePhase(game: Phaser.Game): Phaser.Text {
        let style = {font: '32px Arial', fill: '#ff0044', align: 'center', backgroundColor: '#ffff00'};
        const gamePhase = gameStore.getState().gamePhase;
        let currentPhase = game.add.text(250, 0, GamePhase[gamePhase] + '', style);
        currentPhase.fixedToCamera = true;
        return currentPhase;
    }

    private updateGamePhase(): void {
        this.currentPhase.text = gameStore.getState().gamePhase;
    }
}