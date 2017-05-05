import {TopMenuItem} from './topMenuItem';
import {MenuRounds} from './menuRounds';
import {MenuWildlings} from './menuWildlings';
import {MenuSupply} from './menuSupply';
import {MenuInvluence} from './menuInvluence';
import {MenuVictory} from './menuVictory';

const MENU = 'menu',
    MENU_ITEMS = [MenuRounds, MenuWildlings, MenuSupply, MenuInvluence, MenuVictory];
export default class TopMenu {
    private menu: Array<TopMenuItem> = new Array();

    public loadAssets(game: Phaser.Game) {
        MenuRounds.loadAssets(game);
        MenuWildlings.loadAssets(game);
        MenuSupply.loadAssets(game);
        MenuInvluence.loadAssets(game);
        MenuVictory.loadAssets(game);
     }

    public draw(game: Phaser.Game) {
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

}