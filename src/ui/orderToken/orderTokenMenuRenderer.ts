import Renderer from '../../utils/renderer';
import {OrderToken} from '../../logic/orderToken/orderToken';
import {House} from '../../logic/board/house';
import UiArea from '../../utils/UiArea';
import DragAndDropSupport from '../../utils/dragAndDropSupport';
import AssetLoader from '../../utils/assetLoader';
import TokenPlacementRules from '../../logic/board/gameRules/tokenPlacementRules';
import {gameStore, GameStoreState} from '../../logic/board/gameState/reducer';
import {placeOrder} from '../../logic/board/gameState/actions';
import {GamePhase} from '../../logic/board/gamePhase';
import Game = Phaser.Game;
export class OrderTokenMenuRenderer {

    private placableOrderTokens: Phaser.Group;
    private game: Phaser.Game;
    private menu: Phaser.TileSprite;

    init(game: Game) {
        this.game = game;
        this.menu = this.createMenuBackground(this.game, false);
        this.placableOrderTokens = this.game.add.group();
        gameStore.subscribe(() => {
            this.renderOrderTokenInMenu(gameStore.getState());
        });
    }

    public renderOrderTokenInMenu(state: GameStoreState) {

        if (state.gamePhase === GamePhase.PLANNING) {
            const validAreaToPlaceAnOrder: Array<UiArea> = AssetLoader.getAreaTokens();
            this.menu.visible = true;

            let availableOrderToken = TokenPlacementRules.getPlacableOrderTokenTypes(gameStore.getState().localPlayersHouse);
            this.placableOrderTokens.removeChildren();
            this.placableOrderTokens.createMultiple(1, AssetLoader.ORDER_TOKENS, availableOrderToken, true);
            this.placableOrderTokens.align(0, 0, 50, 45);
            this.placableOrderTokens.fixedToCamera = true;
            this.placableOrderTokens.cameraOffset.x = 10;
            this.placableOrderTokens.cameraOffset.y = window.innerHeight - 55;
            this.placableOrderTokens.forEach((orderToken) => {
                let stopDragAndDropFn = (placableOrderToken) => {
                    this.placeOrderToken(placableOrderToken, validAreaToPlaceAnOrder);
                    Renderer.rerenderRequired = true;
                };
                DragAndDropSupport.createDragAndDrop(orderToken, stopDragAndDropFn);
            }, this, false);
        }
        else {
            this.menu.visible = false;
            this.placableOrderTokens.removeChildren();
        }
    }

    private placeOrderToken(currentSprite, validArea: Array<UiArea>) {
        validArea.forEach((area) => {
            const scale: Phaser.Point = this.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - this.game.camera.x;
            let relativeY = area.y - this.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                gameStore.dispatch(placeOrder(area.name, new OrderToken(gameStore.getState().localPlayersHouse, currentSprite.frame)));
            }
        });
    }

    private createMenuBackground(game: Phaser.Game, visible: boolean): Phaser.TileSprite {
        let menu = game.add.tileSprite(0, window.innerHeight - 60, 50 * 15 + 10, window.innerHeight, AssetLoader.ORDER_TOKEN_MENU_BACKGROUND, 0);
        menu.fixedToCamera = true;
        menu.cameraOffset.y = window.innerHeight - 60;
        menu.visible = visible;
        return menu;
    }
}