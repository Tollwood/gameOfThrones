import * as Assets from '../assets';
import GameRules from '../logic/gameRules';
import {House} from '../logic/house';
import {OrderToken, OrderTokenType} from '../logic/orderToken';
import GameState from '../logic/gameStati';
import {GamePhase} from '../logic/gamePhase';
import UiArea from './UiArea';
import {Area, AreaKey} from '../logic/area';
import {isUndefined} from 'util';
import game = PIXI.game;

export default class OrderTokenRenderer {
    private ORDER_TOKEN_WIDTH: number = 45;
    private ORDER_TOKEN_HEIGHT: number = 45;
    private map: Phaser.Tilemap;
    private areaNames: Array<UiArea>;
    private area: Array<UiArea>;
    private selectedTokenMarker: Phaser.Group;
    private placableOrderTokens: Phaser.Group;
    private placedTokens: Phaser.Group;
    private validAreasToExecuteOrderToken: Phaser.Group;
    private areasToPlaceToken: Phaser.Group;
    private placeableOrderTokenBackground: Phaser.Group;

    constructor() {
    }

    public loadAssets(game: Phaser.Game) {
        game.load.spritesheet('orderTokens', Assets.Images.ImagesOrdertokens45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 11);
        game.load.spritesheet('orderTokenFront', Assets.Images.ImagesOrderTokenFront45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT, 6);
        game.load.tilemap('gotTileMap', Assets.JSON.TilemapGameOfThrones.getJSON(), null, Phaser.Tilemap.TILED_JSON);
        game.load.image('menubackground', Assets.Images.ImagesMenubackground.getPNG());

    }

    public createGroups(game: Phaser.Game) {
        this.areasToPlaceToken = game.add.group();
        this.selectedTokenMarker = game.add.group();
        this.placedTokens = game.add.group();
        this.placeableOrderTokenBackground = game.add.group();
        this.placableOrderTokens = game.add.group();
        this.validAreasToExecuteOrderToken = game.add.group();
        this.map = game.add.tilemap('gotTileMap', 32, 32, 53, 94);
        this.areaNames = this.map.objects['areaNames'].map((area) => {
            return new UiArea(area.height, area.name, area.width, area.x, area.y);
        });

        this.area = this.map.objects['planninglayer'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });

    }

    public renderOrderTokenInMenu(game: Phaser.Game) {
        this.placeableOrderTokenBackground.removeChildren();
        this.placableOrderTokens.removeChildren();
        let menu = game.add.tileSprite(0, window.innerHeight - 60, 50 * 15 + 10, window.innerHeight, 'menubackground', 0, this.placeableOrderTokenBackground);
        menu.fixedToCamera = true;
        menu.cameraOffset.y = window.innerHeight - 60;

        this.placableOrderTokens.createMultiple(1, 'orderTokens', [0, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10], true);
        this.placableOrderTokens.align(0, 0, 50, 45);
        this.placableOrderTokens.fixedToCamera = true;
        this.placableOrderTokens.cameraOffset.x = 10;
        this.placableOrderTokens.cameraOffset.y = window.innerHeight - 55;
        this.placableOrderTokens.forEach((orderToken) => {
            this.creatDragAndDrop(game, orderToken);
        }, this, false);
    }

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House) {
        this.areasToPlaceToken.removeChildren();
        this.area.forEach((area: UiArea) => {
            if (GameRules.isAllowedToPlaceOrderToken(house, area.name))
                game.add.sprite(area.x + (area.width / 2), area.y + (area.height / 2), 'orderTokenFront', house, this.areasToPlaceToken);
        });
    }

    public highlightValidAreasToExecuteOrderToken(game: Phaser.Game, sprite: Phaser.Sprite, matchingArea: UiArea) {
        this.validAreasToExecuteOrderToken.removeChildren();
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
            let game = this.validAreasToExecuteOrderToken.game;
            let graphics = game.add.graphics(0, 0, this.validAreasToExecuteOrderToken);
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
        orderToken.events.onDragStop.add((placableOrderToken) => {
            let successcullyPlaced: boolean = this.placeOrderToken(placableOrderToken);
            if (!successcullyPlaced) {
                // move back to orignalPosition
                placableOrderToken.x = placableOrderToken.originalx;
                placableOrderToken.y = placableOrderToken.originaly;
            }
        });
    }

    private highlightDuringActionPhase(sprite: Phaser.Sprite, matchingArea: UiArea) {
        if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, matchingArea);
            this.highlightValidAreasToExecuteOrderToken(game, sprite, matchingArea);
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

    public placeOrderToken(currentSprite): boolean {
        this.area.forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - currentSprite.game.camera.x;
            let relativeY = area.y - currentSprite.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && GameRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                GameRules.addOrderToken(new OrderToken(GameState.getInstance().currentPlayer, OrderTokenType.march), area.name);
                return true;
            }
        });
        return false;
    }

    private removeSelectedToken(sprite: Phaser.Sprite) {
        sprite.destroy();
        this.selectedTokenMarker.removeChildren();
        this.validAreasToExecuteOrderToken.removeChildren();
        this.selectedTokenMarker.removeChildren();

    }

    public renderPlacedOrderTokens(game: Phaser.Game, revealed: boolean) {
        this.placedTokens.removeChildren();
        GameState.getInstance().areas
            .filter((area) => {
                return !isUndefined(area.orderToken);
                })
            .map((area ) => {
                let uiArea : UiArea = this.getUiAreaByKey(area.key);
                if(area.units[0].getHouse() === GameState.getInstance().currentPlayer){
                    let placedToken = game.add.sprite(uiArea.x + (uiArea.width / 2), uiArea.y + ( uiArea.height / 2), 'orderTokens', area.orderToken.getType(), this.placedTokens);
                    placedToken.inputEnabled = true;
                    placedToken.events.onInputDown.add((sprite) => {
                        this.highlightDuringActionPhase(sprite, uiArea);
                    });
                } else {
                    if(revealed){
                        game.add.sprite(uiArea.x + (uiArea.width / 2), uiArea.y + ( uiArea.height / 2), 'orderTokens', area.orderToken.getType(), this.placedTokens);
                    }
                    else {
                        game.add.sprite(uiArea.x + (uiArea.width / 2), uiArea.y + (uiArea.height / 2), 'orderTokenFront', area.units[0].getHouse(), this.placedTokens);
                    }
                }
            }) ;
    }

    private highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }

    private getUiAreaByKey(key: AreaKey): UiArea {
        return this.area.filter((uiArea) => {return uiArea.name === key;})[0];
    }
}