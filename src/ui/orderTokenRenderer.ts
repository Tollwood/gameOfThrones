import * as Assets from '../assets';
import GameRules from '../logic/gameRules';
import {House} from '../logic/house';
import {OrderToken} from '../logic/orderToken';
import GameState from '../logic/gameStati';
import {GamePhase} from '../logic/gamePhase';
import UiArea from './UiArea';
import {Area, AreaKey} from '../logic/area';
import Renderer from './renderer';
import {EstablishControlModalFactory} from './modals/establishControlModalFactory';
import SplitArmyModalFactory from './modals/splitArmyModalFactory';

export default class OrderTokenRenderer {
    private ORDER_TOKEN_WIDTH: number = 45;
    private ORDER_TOKEN_HEIGHT: number = 45;
    private map: Phaser.Tilemap;
    private areaNames: Array<UiArea>;
    private areaTokens: Array<UiArea>;
    private selectedTokenMarker: Phaser.Group;
    private placableOrderTokens: Phaser.Group;
    private placedTokens: Phaser.Group;
    private validAreasToExecuteOrderToken: Phaser.Group;
    private areasToPlaceToken: Phaser.Group;
    private placeableOrderTokenBackground: Phaser.Group;

    constructor() {
    }

    public loadAssets(game: Phaser.Game) {
        game.load.spritesheet('orderTokens', Assets.Images.ImagesOrdertokens45.getPNG(), this.ORDER_TOKEN_WIDTH, this.ORDER_TOKEN_HEIGHT);
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
        this.areaTokens = this.map.objects['planninglayer'].map((area) => {
            return new UiArea(area.height, area.name, area.height, area.x, area.y);
        });
    }

    public renderOrderTokenInMenu(game: Phaser.Game) {
        this.removeOrderTokenMenu();
        let menu = game.add.tileSprite(0, window.innerHeight - 60, 50 * 15 + 10, window.innerHeight, 'menubackground', 0, this.placeableOrderTokenBackground);
        menu.fixedToCamera = true;
        menu.cameraOffset.y = window.innerHeight - 60;

        let availableOrderToken = GameRules.getAvailableOrderToken(GameState.getInstance().currentPlayer.house);

        this.placableOrderTokens.createMultiple(1, 'orderTokens', availableOrderToken, true);
        this.placableOrderTokens.align(0, 0, 50, 45);
        this.placableOrderTokens.fixedToCamera = true;
        this.placableOrderTokens.cameraOffset.x = 10;
        this.placableOrderTokens.cameraOffset.y = window.innerHeight - 55;
        this.placableOrderTokens.forEach((orderToken) => {
            this.createDragAndDrop(game, orderToken);
        }, this, false);
    }

    public removeOrderTokenMenu() {
        this.placeableOrderTokenBackground.removeChildren();
        this.placableOrderTokens.removeChildren();
    }

    public removePlaceHolder() {
        this.areasToPlaceToken.removeChildren();
    }

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House) {
        this.areasToPlaceToken.removeChildren();
        this.areaTokens.forEach((areaToken: UiArea) => {
            if (GameRules.isAllowedToPlaceOrderToken(house, areaToken.name))
                game.add.sprite(areaToken.x + (areaToken.width / 2), areaToken.y + (areaToken.height / 2), 'orderTokenFront', house, this.areasToPlaceToken);
        });
    }

    private highlightValidAreasToExecuteOrderToken(areasAllowedToExecuteOrder: Array<Area>, onInputDownFunction: Function) {
        this.validAreasToExecuteOrderToken.removeChildren();
        this.areaNames.filter((area) => {
            return areasAllowedToExecuteOrder.filter((border) => {
                    return border.key === area.name;
                }).length > 0;
        }).map((area: UiArea) => {
            let game = this.validAreasToExecuteOrderToken.game;
            this.drawRectangleAroundAreaName(game, area, 0x0000FF, () => {
                onInputDownFunction(area.name);
                Renderer.rerenderRequired = true;
            });

        });
    }

    private drawRectangleAroundAreaName(game, areaName: UiArea, color: number, onInputDown: Function) {
        let graphics = game.add.graphics(0, 0, this.validAreasToExecuteOrderToken);
        graphics.lineStyle(2, color, 1);
        graphics.beginFill(0xdfffb1, 0);
        graphics.drawRect(areaName.x, areaName.y, areaName.width, areaName.height);
        graphics.endFill();
        graphics.inputEnabled = true;
        graphics.events.onInputDown.add(onInputDown);
    }

    public resetOrderTokens(game: Phaser.Game) {
        this.renderOrderTokenInMenu(game);
        this.renderPlaceHolderForOrderToken(game, GameState.getInstance().currentPlayer.house);
    }

    private createDragAndDrop(game: Phaser.Game, orderToken: Phaser.Sprite) {
        orderToken.inputEnabled = true;
        orderToken.input.enableDrag();
        OrderTokenRenderer.fixDragWhileZooming(orderToken);
        orderToken.events.onDragStop.add((placableOrderToken) => {
            this.placeOrderToken(placableOrderToken);
            Renderer.rerenderRequired = true;
        });
    }

    private highlightDuringActionPhase(sprite: Phaser.Sprite, areaKey: AreaKey, onInputDownFunction, areasAllowdToExecuteOrder) {
        let areaToken = this.getAreaTokenByKey(areaKey);
        if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, areaToken);
            this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
            this.highlightAreaNameToSkipOrder(sprite.game, areaToken, sprite);
            Renderer.rerenderRequired = true;
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

    public placeOrderToken(currentSprite) {
        this.areaTokens.forEach((area) => {
            const scale: Phaser.Point = currentSprite.game.camera.scale;
            let boundsA = new Phaser.Rectangle(currentSprite.worldPosition.x * scale.x, currentSprite.worldPosition.y * scale.y, currentSprite.width * scale.x, currentSprite.height * scale.y);
            let relativeX = area.x - currentSprite.game.camera.x;
            let relativeY = area.y - currentSprite.game.camera.y;
            let boundsB = new Phaser.Rectangle(relativeX * scale.x, relativeY * scale.y, area.width * scale.x, area.height * scale.y);
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && GameRules.isAllowedToPlaceOrderToken(House.stark, area.name)) {
                GameRules.addOrderToken(new OrderToken(GameState.getInstance().currentPlayer.house, currentSprite.frame), area.name);
            }
        });
    }

    private removeSelectedToken(sprite: Phaser.Sprite) {
        sprite.destroy();
        this.selectedTokenMarker.removeChildren();
        this.validAreasToExecuteOrderToken.removeChildren();
    }

    public renderPlacedOrderTokens(game: Phaser.Game, revealed: boolean) {
        this.placedTokens.removeChildren();
        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.orderToken !== null;
            })
            .map((sourceArea: Area) => {
                let sourceAreaToken: UiArea = this.getAreaTokenByKey(sourceArea.key);
                if (sourceArea.units[0].getHouse() === GameState.getInstance().currentPlayer.house) {
                    let placedToken: Phaser.Sprite = game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + ( sourceAreaToken.height / 2), 'orderTokens', sourceArea.orderToken.getType(), this.placedTokens);
                    placedToken.inputEnabled = true;
                    if (sourceArea.orderToken.isMoveToken()) {
                        this.onInputDownForMoveToken(game, placedToken, sourceArea);
                    }
                    if (sourceArea.orderToken.isConsolidatePowerToken()) {
                        this.onInputDownForConsolidatePowerToken(placedToken, sourceArea.key);
                    }
                    if (sourceArea.orderToken.isRaidToken()) {
                        this.onInputDownForRaidToken(placedToken, sourceArea.key);
                    }
                } else {
                    if (revealed) {
                        game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + ( sourceAreaToken.height / 2), 'orderTokens', sourceArea.orderToken.getType(), this.placedTokens);
                    }
                    else {
                        game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + (sourceAreaToken.height / 2), 'orderTokenFront', sourceArea.units[0].getHouse(), this.placedTokens);
                    }
                }
            });
    }

    private highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }

    private getAreaTokenByKey(key: AreaKey): UiArea {
        return this.areaTokens.filter((uiArea) => {
            return uiArea.name === key;
        })[0];
    }

    private getAreaNameByKey(key: AreaKey): UiArea {
        return this.areaNames.filter((uiArea) => {
            return uiArea.name === key;
        })[0];
    }

    private highlightAreaNameToSkipOrder(game: Phaser.Game, areaToken: UiArea, selectedToken: Phaser.Sprite) {
        let areaName = this.getAreaNameByKey(areaToken.name);
        this.drawRectangleAroundAreaName(game, areaName, 0xFF0000, () => {
            GameRules.skipOrder(areaToken.name);
            this.removeSelectedToken(selectedToken);
            Renderer.rerenderRequired = true;
        });

    }

    private onInputDownForMoveToken(game: Phaser.Game, placedToken: Phaser.Sprite, sourceArea: Area) {
        placedToken.events.onInputDown.add((sprite) => {
            let moveUnitFunction = (targetAreaKey) => {
                if (sourceArea.units.length > 1) {
                    let yesFn = (units) => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, units, false);
                        Renderer.rerenderRequired = true;
                    };
                    let noFn = (units) => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, units);
                        GameRules.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };
                    SplitArmyModalFactory.showModal(game, sourceArea, targetAreaKey, yesFn, noFn);
                }
                if (sourceArea.units.length === 1 && GameState.getInstance().currentPlayer.powerToken > 0) {
                    let yesFn = () => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
                        GameRules.establishControl(sourceArea);
                        GameRules.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };
                    let noFn = () => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
                        GameRules.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };
                    EstablishControlModalFactory.showModal(game, sourceArea, yesFn, noFn);

                }
                Renderer.rerenderRequired = true;
            };
            let areasAllowedToExecuteOrder: Array<Area> = GameState.getInstance().areas
                .filter((area) => {
                    return GameRules.isAllowedToMove(sourceArea, area, sourceArea.units[0]);
                });
            this.highlightDuringActionPhase(sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder);
            Renderer.rerenderRequired = true;
        });
    }

    private onInputDownForConsolidatePowerToken(placedToken: Phaser.Sprite, areaKey: AreaKey) {
        placedToken.events.onInputDown.add(() => {
            GameRules.executeConsolidatePowerOrder(areaKey);
            Renderer.rerenderRequired = true;
        });
    }

    private onInputDownForRaidToken(placedToken: Phaser.Sprite, areaKey: AreaKey) {
        placedToken.events.onInputDown.add((sprite) => {
            console.log('placedToken clicked');
            let raidAreaFunction = (targetAreaKey) => {
                GameRules.executeRaidOrder(areaKey, targetAreaKey);
                this.removeSelectedToken(sprite);
            };
            let areaToPlaceToken = GameRules.getAreaByKey(areaKey);
            let areasAllowedToExecuteOrder: Array<Area> = GameState.getInstance().areas
                .filter((area) => {
                    return GameRules.isAllowedToRaid(areaToPlaceToken, area);
                });
            this.highlightDuringActionPhase(sprite, areaKey, raidAreaFunction, areasAllowedToExecuteOrder);
        });
    }
}