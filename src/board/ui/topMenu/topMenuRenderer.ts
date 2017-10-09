import {TopMenuItem} from './topMenuItem';
import {MenuRounds} from './menuRounds';
import {MenuWildlings} from './menuWildlings';
import {MenuSupply} from './menuSupply';
import {MenuInvluence} from './menuInvluence';
import {MenuVictory} from './menuVictory';
import {GamePhase} from '../../logic/gamePhase';
import GameState from '../../logic/gameStati';

const MENU = 'menu',
    MENU_ITEMS = [MenuRounds, MenuWildlings, MenuSupply, MenuInvluence, MenuVictory];
export default class TopMenuRenderer {
    private menu: Array<TopMenuItem> = new Array();
    private currentPhase: Phaser.Text;

    public loadAssets(game: Phaser.Game) {
        MenuRounds.loadAssets(game);
        MenuWildlings.loadAssets(game);
        MenuSupply.loadAssets(game);
        MenuInvluence.loadAssets(game);
        MenuVictory.loadAssets(game);
     }

    public renderTopMenu(game: Phaser.Game) {
        this.menu.map((menuItem: TopMenuItem) => {
            menuItem.getOverlay().destroy();
            menuItem.destroy();
        });
        let totalWidth: number = MENU_ITEMS
            .map((menuItem) => {
                return game.cache.getImage(MENU + menuItem).width;
            })
            .reduce((acc, val) => {
                return acc + val;
            }, 0);
         let nextX = (window.innerWidth - totalWidth) / 2;
        this.menu = MENU_ITEMS.map((menuItem): TopMenuItem => {
            const item = new menuItem(game, nextX, 0);
            game.world.add(item);
             nextX += item.width;
            return item;
         });
    }

    public hideOverlayIfNotClicked(): void {
        this.menu.map((menuItem) => {
            menuItem.tween(menuItem.getOverlay(), 0);
        });
    }

    public renderGameState(game: Phaser.Game): void {
        if (this.currentPhase) {
            this.currentPhase.destroy();
        }
        let style = {font: '32px Arial', fill: '#ff0044', align: 'center', backgroundColor: '#ffff00'};
        this.currentPhase = game.add.text(250, 0, GamePhase[GameState.getInstance().gamePhase] + '', style);
        this.currentPhase.fixedToCamera = true;
    }
}