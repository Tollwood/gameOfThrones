import * as Assets from "../assets";
import {GameRules} from "../logic/gameRules";
import {House} from "../logic/house";
import {OrderToken, OrderTokenType} from "../logic/orderToken";
import game = PIXI.game;

export class OrderTokenService {

    private ORDER_TOKEN_WIDTH: number = 45;
    private ORDER_TOKEN_HEIGHT: number = 45;
    private map: Phaser.Tilemap;
    private orderTokens: Phaser.Group;
    private placedTokens: Phaser.Group;
    private gameRules: GameRules;

    constructor() {
        this.gameRules = new GameRules();
    }

    public loadAssets(game: Phaser.Game) {
        game.load.spritesheet('orderTokens', Assets.Images.ImagesOrdertokens45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 11);
        game.load.spritesheet('orderTokenFront', Assets.Images.ImagesOrderTokenFront45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
        game.load.tilemap('gotTileMap', Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);
        game.load.image('menubackground', Assets.Images.ImagesMenubackground.getPNG());

    }

    public creatOrderTokens(game: Phaser.Game) {

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

    public addPlanningLayer(game: Phaser.Game) {
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        let areas: Phaser.Group = game.add.group();
        this.map.objects['planninglayer'].forEach(field => {
            const fieldFront = game.add.sprite(field.x, field.y, 'orderTokenFront', 0, areas);
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
            let matchingPosition: Phaser.Point = this.getPositionOfValidAreaToPlaceOrderToken(currentSprite);
            if (matchingPosition) {
                currentSprite.x = matchingPosition.x;
                currentSprite.y = matchingPosition.y;
                this.orderTokens.remove(currentSprite);
                currentSprite.game.add.sprite(currentSprite.x, currentSprite.y, currentSprite.key, currentSprite.frame, placedTokenGroup);
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

    public getPositionOfValidAreaToPlaceOrderToken(currentSprite): Phaser.Point {
        let matchingBounds: Phaser.Point = null;
        this.map.objects['planninglayer'].forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - currentSprite.game.camera.x;
            let relativeY = area.y - currentSprite.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && this.gameRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                this.gameRules.addOrderToken(new OrderToken(House.stark, OrderTokenType.march), area.name);
                matchingBounds = new Phaser.Point(area.x, area.y);
            }

        }, this, false);
        return matchingBounds;
    }

    public resetOrderTokens(game: Phaser.Game) {
        this.placedTokens.destroy(true);
        this.orderTokens.destroy(true);
        this.creatOrderTokens(game);
    }
}