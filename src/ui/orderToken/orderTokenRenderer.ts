import GameRules from '../../logic/board/gameRules/gameRules';
import {convertHouseToNumber, House} from '../../logic/board/house';

import {GamePhase} from '../../logic/board/gamePhase';
import UiArea from '../../utils/UiArea';
import {Area} from '../../logic/board/area';
import Renderer from '../../utils/renderer';
import EstablishControlModalFactory from '../march/establishControlModalFactory';
import SplitArmyModalFactory from '../march/splitArmyModalFactory';
import {OrderTokenMenuRenderer} from './orderTokenMenuRenderer';
import AssetLoader from '../../utils/assetLoader';
import FightModal from '../march/combatModal';
import GamePhaseService from '../../logic/board/gamePhaseService';
import TokenPlacementRules from '../../logic/board/gameRules/tokenPlacementRules';
import MovementRules from '../../logic/board/gameRules/movementRules';
import {AreaKey} from '../../logic/board/areaKey';

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

    public removePlacedToken() {
        this.placedTokens.removeChildren();
        this.selectedTokenMarker.removeChildren();
        this.validAreasToExecuteOrderToken.removeChildren();
    }

    public renderPlaceHolderForOrderToken(game: Phaser.Game, house: House): number {
        this.areasToPlaceToken.removeChildren();
        let areas = AssetLoader.getAreaTokens().filter((areaToken: UiArea) => {
            return TokenPlacementRules.isAllowedToPlaceOrderToken(house, areaToken.name);
        });
        areas.forEach((areaToken) => {
            game.add.sprite(areaToken.x + (areaToken.width / 2), areaToken.y + (areaToken.height / 2), AssetLoader.ORDER_TOKENS_FRONT, convertHouseToNumber(house), this.areasToPlaceToken);

        });
        return areas.length;
    }

    public renderPlacedOrderTokens(game: Phaser.Game, revealed: boolean) {
        this.placedTokens.removeChildren();
        GameRules.gameState.areas
            .filter((area: Area) => {
                return area.orderToken !== null;
            })
            .map((sourceArea: Area) => {
                let sourceAreaToken: UiArea = AssetLoader.getAreaTokenByKey(sourceArea.key);
                if (sourceArea.controllingHouse === GameRules.gameState.currentPlayer.house) {
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
                        game.add.sprite(sourceAreaToken.x + (sourceAreaToken.width / 2), sourceAreaToken.y + (sourceAreaToken.height / 2), AssetLoader.ORDER_TOKENS_FRONT, convertHouseToNumber(sourceArea.controllingHouse), this.placedTokens);
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
            TokenPlacementRules.skipOrder(areaKey);
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
                if (sourceArea.units.length > 1 && (targetArea.controllingHouse === null || targetArea.controllingHouse === GameRules.gameState.currentPlayer.house || (targetArea.controllingHouse !== GameRules.gameState.currentPlayer.house && targetArea.units.length === 0) )) {
                    let modal = new SplitArmyModalFactory(game, sourceArea, targetAreaKey);
                    modal.show();
                }
                // establish Control
                if (sourceArea.units.length === 1 && GameRules.gameState.currentPlayer.powerToken > 0 && (targetArea.controllingHouse === null || targetArea.controllingHouse === GameRules.gameState.currentPlayer.house)) {

                    let establishControlModal = new EstablishControlModalFactory(game, sourceArea, targetAreaKey);
                    establishControlModal.show();
                }
                // fight
                let onCloseFn = () => {
                    GamePhaseService.nextPlayer();
                    this.removeSelectedToken(sprite);
                    Renderer.rerenderRequired = true;
                };
                if (targetArea.controllingHouse !== GameRules.gameState.currentPlayer.house && targetArea.units.length > 0) {
                    let modal = new FightModal(game, sourceArea, targetArea, onCloseFn);
                    modal.show();
                }
                Renderer.rerenderRequired = true;
            };
            let areasAllowedToExecuteOrder: Array<Area> = MovementRules.getAllAreasAllowedToMarchTo(sourceArea);
            this.highlightDuringActionPhase(sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder, GamePhase.ACTION_MARCH);
            Renderer.rerenderRequired = true;

        });
    }

    private onInputDownForRaidToken(placedToken: Phaser.Sprite, areaKey: AreaKey) {
        placedToken.events.onInputDown.add((sprite) => {

            let raidAreaFunction = (targetAreaKey) => {
                TokenPlacementRules.executeRaidOrder(areaKey, targetAreaKey);
                this.removeSelectedToken(sprite);
            };
            let areaToPlaceToken = GameRules.getAreaByKey(areaKey);
            let areasAllowedToExecuteOrder: Array<Area> = GameRules.gameState.areas
                .filter((area) => {
                    return TokenPlacementRules.isAllowedToRaid(areaToPlaceToken, area);
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
        if (GameRules.gameState.gamePhase === gamePhase) {
            this.selectedTokenMarker.removeChildren();
            this.highlightToken(sprite.game, areaToken);
            this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
            this.highlightAreaNameToSkipOrder(sprite, areaToken.name);
            Renderer.rerenderRequired = true;
        }

    }
}