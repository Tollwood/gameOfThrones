import {TopMenuItem} from './topMenuItem';
import {MenuRounds} from './menuRounds';
import {MenuWildlings} from './menuWildlings';
import {MenuSupply} from './menuSupply';
import {MenuInvluence} from './menuInvluence';
import {MenuVictory} from './menuVictory';
import {GamePhase} from '../../logic/gamePhase';

import * as Assets from '../../../assets';
import {House} from '../../logic/house';
import GameRules from '../../logic/gameRules/gameRules';

const MENU = 'menu',
    MENU_ITEMS = [MenuRounds, MenuWildlings, MenuSupply, MenuInvluence, MenuVictory];
export default class TopMenuRenderer {
    private menu: Array<TopMenuItem> = new Array();
    private currentPhase: Phaser.Text;

    public static MENU = 'menu';
    public static OVERLAY = 'overlay';
    public static INFLUENCE = 'Invluence';
    public static ROUNDS = 'Rounds';
    public static WILDLINGS = 'Wildlings';
    public static SUPPLY = 'Supply';
    public static VICTORY = 'Victory';
    public static CASTLE = 'Castle';


    public loadAssets(game: Phaser.Game) {
        game.load.image(TopMenuRenderer.OVERLAY + TopMenuRenderer.ROUNDS, Assets.Images.ImagesTopMenuGameRoundsGamerounds.getPNG());
        game.load.image(TopMenuRenderer.MENU + TopMenuRenderer.ROUNDS, Assets.Images.ImagesTopMenuMenuRounds.getPNG());
        game.load.image('gameRoundMarker', Assets.Images.ImagesTopMenuGameRoundsGameRoundMarker.getPNG());

        game.load.image(TopMenuRenderer.OVERLAY + TopMenuRenderer.WILDLINGS, Assets.Images.ImagesTopMenuWildlingstatusWildlingStatus.getPNG());
        game.load.image(MENU + TopMenuRenderer.WILDLINGS, Assets.Images.ImagesTopMenuMenuWildlings.getPNG());

        game.load.image(TopMenuRenderer.OVERLAY + TopMenuRenderer.SUPPLY, Assets.Images.ImagesTopMenuSupplySupply.getPNG());
        game.load.image(MENU + TopMenuRenderer.SUPPLY, Assets.Images.ImagesTopMenuMenuSupply.getPNG());

        game.load.image(TopMenuRenderer.OVERLAY + TopMenuRenderer.INFLUENCE, Assets.Images.ImagesTopMenuInfluenceInfluence.getPNG());
        game.load.image(MENU + TopMenuRenderer.INFLUENCE, Assets.Images.ImagesTopMenuMenuInvluence.getPNG());

        game.load.image(TopMenuRenderer.OVERLAY + TopMenuRenderer.VICTORY, Assets.Images.ImagesTopMenuVictoryVictory.getPNG());
        game.load.image(MENU + TopMenuRenderer.VICTORY, Assets.Images.ImagesTopMenuMenuVictory.getPNG());
        game.load.image(House[House.stark] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleStark.getPNG());
        game.load.image(House[House.baratheon] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleBaratheon.getPNG());
        game.load.image(House[House.greyjoy] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleGreyjoy.getPNG());
        game.load.image(House[House.lannister] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleLannister.getPNG());
        game.load.image(House[House.martell] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleMartell.getPNG());
        game.load.image(House[House.tyrell] + TopMenuRenderer.CASTLE, Assets.Images.ImagesTopMenuVictoryCastleTyrell.getPNG());

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

    public renderGameState(game: Phaser.Game): void {
        if (this.currentPhase) {
            this.currentPhase.destroy();
        }
        let style = {font: '32px Arial', fill: '#ff0044', align: 'center', backgroundColor: '#ffff00'};
        this.currentPhase = game.add.text(250, 0, GamePhase[GameRules.gameState.gamePhase] + '', style);
        this.currentPhase.fixedToCamera = true;
    }
}