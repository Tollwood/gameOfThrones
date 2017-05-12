import * as Assets from '../assets';
import GameRules from '../logic/gameRules';
import {House} from '../logic/house';
import {OrderToken, OrderTokenType} from '../logic/orderToken';
import GameState from '../logic/gameStati';
import {GamePhase} from '../logic/gamePhase';
import UiArea from './UiArea';
import {Area} from '../logic/area';
import game = PIXI.game;

export default class OrderTokenRenderer {
    private ORDER_TOKEN_WIDTH: number = 45;
    private ORDER_TOKEN_HEIGHT: number = 45;
    private map: Phaser.Tilemap;
    private areaNames: Array<UiArea>;
    private area: Array<UiArea>;
    private selectedTokenMarker: Phaser.Group;
    private orderTokens: Phaser.Group;
    private placedTokens: Phaser.Group;
    private neighborsOfCurrentToken: Phaser.Group;
    private areasToPlaceToken: Phaser.Group;

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

    public createGroups(game: Phaser.Game) {
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        this.neighborsOfCurrentToken = game.add.group();
        this.areasToPlaceToken = game.add.group();
        this.areaNames = this.map.objects['areaNames'].map((area) => {
            return new UiArea(area.height, area.name, area.width, area.x, area.y);
        });

        this.area = this.map.objects['planninglayer'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });

    }

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House) {
        this.areasToPlaceToken.removeChildren();
        this.area.forEach((area: UiArea) => {
            if (GameRules.isAllowedToPlaceOrderToken(house, area.name))
                game.add.sprite(area.x + (area.width / 2), area.y + (area.height / 2), 'orderTokenFront', house, this.areasToPlaceToken);
        });
    }

    public highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }

    public highlightNeigbors(game: Phaser.Game, sprite: Phaser.Sprite, matchingArea: UiArea) {
        this.neighborsOfCurrentToken.removeChildren();
        let areaToPlaceToken = GameRules.getAreaByKey(matchingArea.name);
        let areasAllowedToMoveTo: Array<Area> = GameState.getInstance().areas
            .filter((area) => {
                return GameRules.isAllowedToMove(areaToPlaceToken, area, areaToPlaceToken.units[0]);
            });



        this.areaNames.filter((area) => {
            return areasAllowedToMoveTo.filter((border) => {
                    return border.key === area.name;
                }).length > 0;
        }).map((area: UiArea) => {
            let game = this.neighborsOfCurrentToken.game;
            let graphics = game.add.graphics(0, 0, this.neighborsOfCurrentToken);
            graphics.lineStyle(2, 0x0000FF, 1);
            graphics.beginFill(0xdfffb1, 0);
            graphics.drawRect(area.x, area.y, area.width, area.height);
            graphics.endFill();
            graphics.inputEnabled = true;
            graphics.events.onInputDown.add(() => {
                let validMove = GameRules.moveUnits(matchingArea.name, area.name, GameRules.getAreaByKey(matchingArea.name).units[0]);
                if (validMove) {
                    this.removeSelectedToken(sprite);
                }
            });
        });
    }

    public resetOrderTokens(game: Phaser.Game) {
        this.placedTokens.removeChildren();
        this.orderTokens.removeChildren();
        this.selectedTokenMarker.removeChildren();
        this.neighborsOfCurrentToken.removeChildren();
        this.areasToPlaceToken.removeChildren();
        this.renderOrderTokenInMenu(game);
        this.renderPlaceHolderForOrderToken(game, GameState.getInstance().currentPlayer);
    }

    private creatDragAndDrop(game: Phaser.Game, orderToken: Phaser.Sprite) {
        orderToken.inputEnabled = true;
        orderToken.input.enableDrag();
        OrderTokenRenderer.fixDragWhileZooming(orderToken);
        orderToken.events.onInputDown.add((sprite) => {
            sprite.originalx = sprite.x;
            sprite.originaly = sprite.y;
        });
        let placedTokenGroup = this.placedTokens;
        orderToken.events.onDragStop.add((placableOrderToken) => {
            let matchingArea: UiArea = this.getPositionOfValidAreaToPlaceOrderToken(placableOrderToken);
            if (matchingArea) {
                this.orderTokens.remove(placableOrderToken);
                let placedToken = placableOrderToken.game.add.sprite(matchingArea.x + (matchingArea.width / 2), matchingArea.y + ( matchingArea.height / 2), placableOrderToken.key, placableOrderToken.frame, placedTokenGroup);
                placedToken.inputEnabled = true;
                placedToken.events.onInputDown.add((sprite) => {
                    this.addOnInputDownBehaviour(sprite, matchingArea);
                });
                placableOrderToken.destroy();

            } else {
                // move back to orignalPosition
                placableOrderToken.x = placableOrderToken.originalx;
                placableOrderToken.y = placableOrderToken.originaly;
            }
        });
    }

    private addOnInputDownBehaviour(sprite: Phaser.Sprite, matchingArea: UiArea) {
        if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, matchingArea);
            this.highlightNeigbors(game, sprite, matchingArea);
        }

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

    private removeSelectedToken(sprite: Phaser.Sprite) {
        sprite.destroy();
        this.selectedTokenMarker.removeChildren();
        this.neighborsOfCurrentToken.removeChildren();
        this.selectedTokenMarker.removeChildren();

    }
}