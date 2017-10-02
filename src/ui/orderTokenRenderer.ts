import GameRules from '../logic/gameRules';
import {House} from '../logic/house';
import GameState from '../logic/gameStati';
import {GamePhase} from '../logic/gamePhase';
import UiArea from './UiArea';
import {Area, AreaKey} from '../logic/area';
import Renderer from './renderer';
import EstablishControlModalFactory from './modals/establishControlModalFactory';
import SplitArmyModalFactory from './modals/splitArmyModalFactory';
import {OrderTokenMenuRenderer} from './orderTokenMenuRenderer';
import AssetLoader from './assetLoader';

export default class OrderTokenRenderer {

    private selectedTokenMarker: Phaser.Group;
    private placedTokens: Phaser.Group;
    private validAreasToExecuteOrderToken: Phaser.Group;
    private areasToPlaceToken: Phaser.Group;

    public createGroups(game: Phaser.Game) {
        this.areasToPlaceToken = game.add.group();
        this.selectedTokenMarker = game.add.group();
        this.placedTokens = game.add.group();
        OrderTokenMenuRenderer.createGroups(game);
        this.validAreasToExecuteOrderToken = game.add.group();
    }

    public removePlaceHolder() {
        this.areasToPlaceToken.removeChildren();
    }

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House) {
        this.areasToPlaceToken.removeChildren();
        AssetLoader.getAreaTokens().forEach((areaToken: UiArea) => {
            if (GameRules.isAllowedToPlaceOrderToken(house, areaToken.name))
                game.add.sprite(areaToken.x + (areaToken.width / 2), areaToken.y + (areaToken.height / 2), 'orderTokenFront', house, this.areasToPlaceToken);
        });
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
                    let placedToken: Phaser.Sprite = game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + ( sourceAreaToken.height / 2), AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.placedTokens);
                    placedToken.inputEnabled = true;
                    if (sourceArea.orderToken.isMoveToken()) {
                        this.onInputDownForMoveToken(game, placedToken, sourceArea);
                    }
                    if (sourceArea.orderToken.isRaidToken()) {
                        this.onInputDownForRaidToken(placedToken, sourceArea.key);
                    }
                } else {
                    if (revealed) {
                        game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + ( sourceAreaToken.height / 2), AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.placedTokens);
                    }
                    else {
                        game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + (sourceAreaToken.height / 2), AssetLoader.ORDER_TOKENS_FRONT, sourceArea.units[0].getHouse(), this.placedTokens);
                    }
                }
            });
    }

    private highlightValidAreasToExecuteOrderToken(areasAllowedToExecuteOrder: Array<Area>, onInputDownFunction: Function) {
        this.validAreasToExecuteOrderToken.removeChildren();
        AssetLoader.getAreaNames().filter((area) => {
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

    private highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }

    private getAreaTokenByKey(key: AreaKey): UiArea {
        return AssetLoader.getAreaTokens().filter((uiArea) => {
            return uiArea.name === key;
        })[0];
    }

    private getAreaNameByKey(key: AreaKey): UiArea {
        return AssetLoader.getAreaNames().filter((uiArea) => {
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
            this.highlightDuringActionPhase(sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder, GamePhase.ACTION_MARCH);
            Renderer.rerenderRequired = true;

        });
    }

    private onInputDownForRaidToken(placedToken: Phaser.Sprite, areaKey: AreaKey) {
        placedToken.events.onInputDown.add((sprite) => {

            let raidAreaFunction = (targetAreaKey) => {
                GameRules.executeRaidOrder(areaKey, targetAreaKey);
                this.removeSelectedToken(sprite);
            };
            let areaToPlaceToken = GameRules.getAreaByKey(areaKey);
            let areasAllowedToExecuteOrder: Array<Area> = GameState.getInstance().areas
                .filter((area) => {
                    return GameRules.isAllowedToRaid(areaToPlaceToken, area);
                });
            this.highlightDuringActionPhase(sprite, areaKey, raidAreaFunction, areasAllowedToExecuteOrder, GamePhase.ACTION_RAID);
        });
    }

    private removeSelectedToken(sprite: Phaser.Sprite) {
        sprite.destroy();
        this.selectedTokenMarker.removeChildren();
        this.validAreasToExecuteOrderToken.removeChildren();
    }

    private highlightDuringActionPhase(sprite: Phaser.Sprite, areaKey: AreaKey, onInputDownFunction, areasAllowdToExecuteOrder, gamePhase: GamePhase) {
        let areaToken = this.getAreaTokenByKey(areaKey);
        if (GameState.getInstance().gamePhase === gamePhase) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, areaToken);
            this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
            this.highlightAreaNameToSkipOrder(sprite.game, areaToken, sprite);
            Renderer.rerenderRequired = true;
        }

    }
}