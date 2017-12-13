import Renderer from '../../utils/renderer';
import {OrderToken} from '../../logic/orderToken/orderToken';
import {House} from '../../logic/board/house';
import UiArea from '../../utils/UiArea';
import DragAndDropSupport from '../../utils/dragAndDropSupport';
import AssetLoader from '../../utils/assetLoader';
import TokenPlacementRules from '../../logic/board/gameRules/tokenPlacementRules';
import {gameStore} from '../../logic/board/gameState/reducer';
import {placeOrder} from '../../logic/board/gameState/actions';
export class OrderTokenMenuRenderer {

    private static placableOrderTokens: Phaser.Group;
    private static placeableOrderTokenBackground: Phaser.Group;

    public static createGroups(game: Phaser.Game) {
        this.placeableOrderTokenBackground = game.add.group();
        this.placableOrderTokens = game.add.group();
    }

    public static renderOrderTokenInMenu(game: Phaser.Game, validAreaToPlaceAnOrder: Array<UiArea>) {
        this.removeOrderTokenMenu();
        let menu = game.add.tileSprite(0, window.innerHeight - 60, 50 * 15 + 10, window.innerHeight, AssetLoader.ORDER_TOKEN_MENU_BACKGROUND, 0, this.placeableOrderTokenBackground);
        menu.fixedToCamera = true;
        menu.cameraOffset.y = window.innerHeight - 60;

        let availableOrderToken = TokenPlacementRules.getPlacableOrderTokenTypes(gameStore.getState().currentHouse);

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

    public static removeOrderTokenMenu() {
        this.placeableOrderTokenBackground.removeChildren();
        this.placableOrderTokens.removeChildren();
    }

    private static placeOrderToken(currentSprite, validArea: Array<UiArea>) {
        validArea.forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - currentSprite.game.camera.x;
            let relativeY = area.y - currentSprite.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && TokenPlacementRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                gameStore.dispatch(placeOrder(area.name, new OrderToken(gameStore.getState().currentHouse, currentSprite.frame)));
            }
        });
    }

}