import {convertHouseToNumber} from '../../logic/board/house';

import {GamePhase} from '../../logic/board/gamePhase';
import {Area} from '../../logic/board/area';
import Renderer from '../../utils/renderer';
import EstablishControlModalFactory from '../march/establishControlModal';
import SplitArmyModalFactory from '../march/splitArmyModal';
import AssetLoader from '../../utils/assetLoader';
import FightModal from '../march/combatModal';
import TokenPlacementRules from '../../logic/board/gameRules/tokenPlacementRules';
import StateSelectorService from '../../logic/board/gameRules/stateSelectorService';
import {AreaKey} from '../../logic/board/areaKey';
import {gameStore} from '../../logic/board/gameState/reducer';
import {executeRaidOrder, skipOrder} from '../../logic/board/gameState/actions';
import {GameStoreState} from '../../logic/board/gameState/gameStoreState';

export default class OrderTokenRenderer {

    private renderer: Renderer;

    public init(renderer: Renderer) {
        this.renderer = renderer;
        gameStore.subscribe(() => {
            this.renderPlaceHolderForOrderToken(gameStore.getState());
            this.renderPlacedOrderTokens(gameStore.getState());
        });
    }

    private renderPlaceHolderForOrderToken(state: GameStoreState) {
        this.renderer.areasToPlaceToken.removeChildren();
        if (state.gamePhase === GamePhase.PLANNING) {
            AssetLoader.getAreaTokens()
                .filter(areaToken => TokenPlacementRules.isAllowedToPlaceOrderToken(state.localPlayersHouse, areaToken.name))
                .forEach(areaToken => this.renderer.addSprite(areaToken.name, AssetLoader.ORDER_TOKENS_FRONT, convertHouseToNumber(state.localPlayersHouse), this.renderer.areasToPlaceToken));
        }
    }

    private renderPlacedOrderTokens(state) {
        this.renderer.placedTokens.removeChildren();
        if (state.gamePhase === GamePhase.PLANNING) {
            state.areas.values()
                .filter(area => area.orderToken !== null)
                .map((sourceArea: Area) => {
                    if (sourceArea.controllingHouse === state.localPlayersHouse) {
                        this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
                    }
                    else {
                        this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS_FRONT, convertHouseToNumber(sourceArea.controllingHouse), this.renderer.placedTokens);
                    }
                });
        }
        else if (state.gamePhase === GamePhase.ACTION_RAID || state.gamePhase === GamePhase.ACTION_MARCH) {
            state.areas.values()
                .filter(area => area.orderToken !== null)
                .map((sourceArea: Area) => {
                    if (sourceArea.controllingHouse === state.localPlayersHouse) {
                        let placedToken: Phaser.Sprite = this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
                        placedToken.inputEnabled = true;
                        if (sourceArea.orderToken.isMoveToken()) {
                            this.onInputDownForMoveToken(state, placedToken, sourceArea);
                        }
                        if (sourceArea.orderToken.isRaidToken()) {
                            this.onInputDownForRaidToken(placedToken, sourceArea.key);
                        }
                    } else {
                        this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
                    }
                });
        }
    }

    private highlightValidAreasToExecuteOrderToken(areasAllowedToExecuteOrder: Array<Area>, onInputDownFunction: Function) {
        this.renderer.validAreasToExecuteOrderToken.removeChildren();
        AssetLoader.getAreaNames()
            .filter(area => areasAllowedToExecuteOrder.filter(border => border.key === area.name).length > 0)
            .forEach(area => {
                this.renderer.drawRectangleAroundAreaName(area.name, 0x0000FF, () => {
                    onInputDownFunction(area.name);
                }, this.renderer.validAreasToExecuteOrderToken);
            });
    }

    private highlightAreaNameToSkipOrder(sprite: Phaser.Sprite, areaKey: AreaKey) {
        let skipOrderFn = () => {
            gameStore.dispatch(skipOrder(areaKey));
            this.renderer.removeSelectedToken();
        };
        this.renderer.drawRectangleAroundAreaName(areaKey, 0xFF0000, skipOrderFn, this.renderer.validAreasToExecuteOrderToken);
    }

    private onInputDownForMoveToken(state: GameStoreState, placedToken: Phaser.Sprite, sourceArea: Area) {
        placedToken.events.onInputDown.add((sprite) => {
            const currentHouse = state.currentHouse;
            let moveUnitFunction = (targetAreaKey) => {
                // splitArmy
                let targetArea = StateSelectorService.getAreaByKey(targetAreaKey);
                if (sourceArea.units.length > 1 && (targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse || (targetArea.controllingHouse !== currentHouse && targetArea.units.length === 0) )) {
                    let modal = new SplitArmyModalFactory(this.renderer, sourceArea, targetAreaKey, () => {
                        this.renderer.removeSelectedToken();
                    });
                    modal.show();
                }
                // establish Control
                if (sourceArea.units.length === 1 && StateSelectorService.getPlayerByHouse(currentHouse).powerToken > 0 && (targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse)) {

                    let establishControlModal = new EstablishControlModalFactory(this.renderer, sourceArea, targetAreaKey, () => {
                        this.renderer.removeSelectedToken();
                    });
                    establishControlModal.show();
                }
                // fight
                let onCloseFn = () => {
                    this.renderer.removeSelectedToken();
                };
                if (targetArea.controllingHouse !== currentHouse && targetArea.units.length > 0) {
                    let modal = new FightModal(this.renderer, sourceArea, targetArea, onCloseFn);
                    modal.show();
                }
            };
            let areasAllowedToExecuteOrder: Array<Area> = StateSelectorService.getAllAreasAllowedToMarchTo(state, sourceArea);
            if (gameStore.getState().gamePhase === GamePhase.ACTION_MARCH) {
                this.highlightDuringActionPhase(sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder);
            }
        });
    }

    private onInputDownForRaidToken(placedToken: Phaser.Sprite, areaKey: AreaKey) {
        placedToken.events.onInputDown.add((sprite) => {

            let raidAreaFunction = (targetAreaKey) => {
                gameStore.dispatch(executeRaidOrder(areaKey, targetAreaKey));
                this.renderer.removeSelectedToken();
            };
            let areaToPlaceToken = StateSelectorService.getAreaByKey(areaKey);
            let areasAllowedToExecuteOrder: Array<Area> = gameStore.getState().areas.values()
                .filter((area) => {
                    return TokenPlacementRules.isAllowedToRaid(areaToPlaceToken, area);
                });
            if (gameStore.getState().gamePhase === GamePhase.ACTION_RAID) {
                this.highlightDuringActionPhase(sprite, areaKey, raidAreaFunction, areasAllowedToExecuteOrder);
            }
        });
    }

    private highlightDuringActionPhase(sprite: Phaser.Sprite, areaKey: AreaKey, onInputDownFunction, areasAllowdToExecuteOrder) {
        this.renderer.highlightToken(areaKey);
        this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
        this.highlightAreaNameToSkipOrder(sprite, areaKey);

    }
}