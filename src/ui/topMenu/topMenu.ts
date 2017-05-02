import {topMenuItem} from "./topMenuItem";
import {menuRounds} from "./menuRounds";
import {menuWildlings} from "./menuWildlings";
import {menuSupply} from "./menuSupply";
import {menuInvluence} from "./menuInvluence";
import {menuVictory} from "./menuVictory";

const MENU = 'menu',
    MENU_ITEMS = [menuRounds, menuWildlings, menuSupply, menuInvluence, menuVictory];
export class TopMenu {
    private menu: Array<topMenuItem> = new Array();

     public loadAssets(game: Phaser.Game){
         menuRounds.loadAssets(game);
         menuWildlings.loadAssets(game);
         menuSupply.loadAssets(game);
         menuInvluence.loadAssets(game);
         menuVictory.loadAssets(game);
     }

    public draw(game: Phaser.Game){
        this.menu.map((menuItem: topMenuItem) => {
            menuItem.getOverlay().destroy();
            menuItem.destroy();
        });
        let totalWidth : number =  MENU_ITEMS
             .map((menuItem) => {return game.cache.getImage(MENU+ menuItem).width; })
             .reduce((acc, val)=>{return acc + val },0);
         let nextX = (window.innerWidth - totalWidth) / 2;
        this.menu = MENU_ITEMS.map((menuItem): topMenuItem => {
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