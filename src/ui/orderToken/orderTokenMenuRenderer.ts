import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {OrderToken} from '../../logic/orderToken/orderToken';
import {House} from '../../logic/board/house';
import UiArea from '../../utils/UiArea';
import AssetLoader from '../../utils/assetLoader';
import TokenPlacementRules from '../../logic/board/gameRules/tokenPlacementRules';
import {gameStore} from '../../logic/board/gameState/reducer';
import {placeOrder} from '../../logic/board/gameState/actions';
import {GamePhase} from '../../logic/board/gamePhase';
import Renderer from '../../utils/renderer';
import {OrderTokenType} from '../../logic/orderToken/orderTokenType';
import UiInteractionSupport from '../../utils/uiInteractionSupport';
import {GameStoreState} from '../../logic/board/gameState/gameStoreState';

export class OrderTokenMenuRenderer {
    private _renderer: Renderer;

    init(renderer: Renderer) {
        this._renderer = renderer;
        gameStore.subscribe(() => {
            this.renderOrderTokenInMenu(gameStore.getState());
        });
    }

    private renderOrderTokenInMenu(state: GameStoreState) {
        if (state.gamePhase === GamePhase.PLANNING) {
            let availableOrderToken: OrderTokenType[] = TokenPlacementRules.getPlacableOrderTokenTypes(state, state.localPlayersHouse);
            this._renderer.displayOrderTokenInMenu(availableOrderToken, (sprite: Phaser.Sprite) => {
                this.placeOrderToken(sprite);
            });
        }
        else {
            this._renderer.hidePlaceAbleOrderToken();
        }
    }

    private placeOrderToken(sprite) {
        const localPlayersHouse: House = gameStore.getState().localPlayersHouse;
        AssetLoader.getAreaTokens().forEach((area: UiArea) => {
            if (UiInteractionSupport.intersects(this._renderer.game.camera, sprite, area) && TokenPlacementRules.isAllowedToPlaceOrderToken(localPlayersHouse, area.name)) {
                gameStore.dispatch(placeOrder(area.name, new OrderToken(localPlayersHouse, sprite.frame)));
            }
        });
    }
}
