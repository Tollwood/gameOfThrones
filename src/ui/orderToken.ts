import * as Assets from '../assets';
import GameRules from '../logic/gameRules';
import {House} from '../logic/house';
import {OrderToken, OrderTokenType} from '../logic/orderToken';
import GameState from '../logic/gameStati';
import {GamePhase} from '../logic/gamePhase';
import UiArea from './UiArea';
import game = PIXI.game;

export default class OrderTokenService {

    private ORDER_TOKEN_WIDTH: number = 45;
    private ORDER_TOKEN_HEIGHT: number = 45;
    private map: Phaser.Tilemap;
    private area: Array<UiArea>;
    private selectedTokenMarker: Phaser.Group;
    private orderTokens: Phaser.Group;
    private placedTokens: Phaser.Group;

    constructor() {
    }

    public loadAssets(game: Phaser.Game) {
        game.load.spritesheet('orderTokens', Assets.Images.ImagesOrdertokens45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 11);
        game.load.spritesheet('orderTokenFront', Assets.Images.ImagesOrderTokenFront45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
        game.load.tilemap('gotTileMap', Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);
        game.load.image('menubackground', Assets.Images.ImagesMenubackground.getPNG());

    }

    public renderOrderTokenInMenu(game: Phaser.Game) {
        this.selectedTokenMarker = game.add.group();
        this.placedTokens = game.add.group();

        let menu = game.add.tileSprite(0, window.innerHeight - 60, 50 * 15 + 10, window.innerHeight, 'menubackground');
        menu.fixedToCamera = true;
        menu.cameraOffset.y = window.innerHeight - 60;
        this.orderTokens = game.add.group();
        this.orderTokens.createMultiple(1, 'orderTokens', [0, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10], true);
        this.orderTokens.align(0, 0, 50, 45);

        this.orderTokens.fixedToCamera = true;
        this.orderTokens.cameraOffset.x = 10;
        this.orderTokens.cameraOffset.y = window.innerHeight - 55;

        this.orderTokens.forEach((orderToken) => {
            this.creatDragAndDrop(game, orderToken);
        }, this, false);
    }

    public addPlanningLayer(game: Phaser.Game, house: House) {
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        let areaNames = game.add.group();

        /* this.map.objects['areaNames'].map((area) => {
         let graphics = game.add.graphics(0, 0, areaNames);
         graphics.lineStyle(2, 0x0000FF, 1);
         graphics.drawRect(area.x, area.y, area.width, area.height);
         });
         */
        this.area = this.map.objects['planninglayer'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y)
        });

        let areas: Phaser.Group = game.add.group();
        this.area.forEach((area: UiArea) => {
            if (GameRules.isAllowedToPlaceOrderToken(house, area.name))
                game.add.sprite(area.x + (area.width / 2), area.y + (area.height / 2), 'orderTokenFront', 0, areas);
        });
    }

    private creatDragAndDrop(game: Phaser.Game, orderToken: Phaser.Sprite) {
        orderToken.inputEnabled = true;
        orderToken.input.enableDrag();
        OrderTokenService.fixDragWhileZooming(orderToken);
        orderToken.events.onInputDown.add(function (currentSprite) {
            currentSprite.originalx = currentSprite.x;
            currentSprite.originaly = currentSprite.y;
        }, this);
        let placedTokenGroup = this.placedTokens;
        orderToken.events.onDragStop.add(function (currentSprite) {
            let matchingArea: any = this.getPositionOfValidAreaToPlaceOrderToken(currentSprite);
            if (matchingArea) {
                currentSprite.x = matchingArea.x;
                currentSprite.y = matchingArea.y;
                this.orderTokens.remove(currentSprite);
                let placedToken = currentSprite.game.add.sprite(currentSprite.x + (currentSprite.width / 2), currentSprite.y + ( currentSprite.height / 2), currentSprite.key, currentSprite.frame, placedTokenGroup);
                placedToken.inputEnabled = true;
                placedToken.events.onInputDown.add((currentSprite) => {
                    if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
                        this.selectedTokenMarker.removeChildren();
                        this.highlightToken(currentSprite.game, matchingArea);
                    }
                });

            } else {
                // move back to orignalPosition
                currentSprite.x = currentSprite.originalx;
                currentSprite.y = currentSprite.originaly;
            }
        }, this);
    }

    private static fixDragWhileZooming(sprite) {

        sprite.events.onDragUpdate.add(function (sprite, pointer) {
            const pos = sprite.game.input.getLocalPosition(sprite.parent, pointer);
            if (sprite.hitArea) {
                sprite.x = pos.x - sprite.hitArea.width / 2;
                sprite.y = pos.y - sprite.hitArea.height / 2;
            } else {
                sprite.x = pos.x - sprite.width / 2;
                sprite.y = pos.y - sprite.height / 2;
            }
        }, sprite);
        return sprite;
    }

    public getPositionOfValidAreaToPlaceOrderToken(currentSprite): UiArea {
        let matchingBounds: UiArea = null;
        this.area.forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - currentSprite.game.camera.x;
            let relativeY = area.y - currentSprite.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && GameRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                GameRules.addOrderToken(new OrderToken(GameState.getInstance().currentPlayer, OrderTokenType.march), area.name);
                matchingBounds = area;
            }
        });
        return matchingBounds;
    }

    public resetOrderTokens(game: Phaser.Game) {
        this.placedTokens.destroy(true);
        this.orderTokens.destroy(true);
        this.renderOrderTokenInMenu(game);
    }

    public highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }
}