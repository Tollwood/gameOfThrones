import GameRules from '../../board/logic/gameRules';
import {House} from '../../board/logic/house';
import GameState from '../../board/logic/gameStati';
import {GamePhase} from '../../board/logic/gamePhase';
import UiArea from '../../utils/UiArea';
import {Area, AreaKey} from '../../board/logic/area';
import Renderer from '../../utils/renderer';
import EstablishControlModalFactory from '../../march/establishControlModalFactory';
import SplitArmyModalFactory from '../../march/splitArmyModalFactory';
import {OrderTokenMenuRenderer} from './orderTokenMenuRenderer';
import AssetLoader from '../../utils/assetLoader';
import FightModal from '../../march/combatModal';
import GamePhaseService from '../../board/logic/gamePhaseService';

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

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House): number {
        this.areasToPlaceToken.removeChildren();
        let areas = AssetLoader.getAreaTokens().filter((areaToken: UiArea) => {
            return GameRules.isAllowedToPlaceOrderToken(house, areaToken.name);
        });
        areas.forEach((areaToken) => {
            game.add.sprite(areaToken.x + (areaToken.width / 2), areaToken.y + (areaToken.height / 2), AssetLoader.ORDER_TOKENS_FRONT, house, this.areasToPlaceToken);

        });
        return areas.length;
    }

    public renderPlacedOrderTokens(game: Phaser.Game, revealed: boolean) {
        this.placedTokens.removeChildren();
        GameState.getInstance().areas
            .filter((area: Area) => {
                return area.orderToken !== null;
            })
            .map((sourceArea: Area) => {
                let sourceAreaToken: UiArea = AssetLoader.getAreaTokenByKey(sourceArea.key);
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
            Renderer.drawRectangleAroundAreaName(game, area.name, 0x0000FF, () => {
                onInputDownFunction(area.name);
                Renderer.rerenderRequired = true;
            }, this.validAreasToExecuteOrderToken);

        });
    }

    private highlightToken(game: Phaser.Game, area: UiArea) {
        let graphics = game.add.graphics(0, 0, this.selectedTokenMarker);
        graphics.beginFill(0x00FF00, 1);
        graphics.drawCircle(area.x + area.width, area.y + area.height, area.width + 5);
    }

    private highlightAreaNameToSkipOrder(sprite: Phaser.Sprite, areaKey: AreaKey) {
        let skipOrderFn = () => {
            GameRules.skipOrder(areaKey);
            this.removeSelectedToken(sprite);
            Renderer.rerenderRequired = true;
        };
        Renderer.drawRectangleAroundAreaName(sprite.game, areaKey, 0xFF0000, skipOrderFn, this.validAreasToExecuteOrderToken);
    }

    private onInputDownForMoveToken(game: Phaser.Game, placedToken: Phaser.Sprite, sourceArea: Area) {
        placedToken.events.onInputDown.add((sprite) => {

            let moveUnitFunction = (targetAreaKey) => {
                // splitArmy
                let targetArea = GameRules.getAreaByKey(targetAreaKey);
                if (sourceArea.units.length > 1 && (targetArea.controllingHouse === null || targetArea.controllingHouse === GameState.getInstance().currentPlayer.house)) {
                    // establish control
                    let yesFn = (units) => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, units, false);
                        Renderer.rerenderRequired = true;
                    };
                    let noFn = (units) => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, units);
                        GamePhaseService.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };
                    SplitArmyModalFactory.showModal(game, sourceArea, targetAreaKey, yesFn, noFn);
                }
                // establish Control
                if (sourceArea.units.length === 1 && GameState.getInstance().currentPlayer.powerToken > 0 && (targetArea.controllingHouse === null || targetArea.controllingHouse === GameState.getInstance().currentPlayer.house)) {
                    let yesFn = () => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
                        GameRules.establishControl(sourceArea);
                        GamePhaseService.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };
                    let noFn = () => {
                        GameRules.moveUnits(sourceArea.key, targetAreaKey, sourceArea.units);
                        GamePhaseService.nextPlayer();
                        this.removeSelectedToken(sprite);
                        Renderer.rerenderRequired = true;
                    };

                    EstablishControlModalFactory.showModal(game, sourceArea, yesFn, noFn);
                }
                // fight
                let onCloseFn = () => {
                    GamePhaseService.nextPlayer();
                    this.removeSelectedToken(sprite);
                    Renderer.rerenderRequired = true;
                };
                if (targetArea.controllingHouse !== GameState.getInstance().currentPlayer.house && targetArea.units.length > 0) {
                    FightModal.showModal(game, sourceArea, targetArea, onCloseFn);
                }
                Renderer.rerenderRequired = true;
            };
            let areasAllowedToExecuteOrder: Array<Area> = GameRules.getAllAreasAllowedToMarchTo(sourceArea);
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
        let areaToken = AssetLoader.getAreaTokenByKey(areaKey);
        if (GameState.getInstance().gamePhase === gamePhase) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, areaToken);
            this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
            this.highlightAreaNameToSkipOrder(sprite, areaToken.name);
            Renderer.rerenderRequired = true;
        }

    }
}