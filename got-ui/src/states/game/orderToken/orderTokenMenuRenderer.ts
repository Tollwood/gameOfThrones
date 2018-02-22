import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {
  ActionFactory, GamePhase, GameStoreState, House, OrderToken, OrderTokenType,
  StateSelectorService
} from 'got-store';
import UiArea from '../../../utils/UiArea';
import AssetLoader from '../../../utils/assetLoader';
import Renderer from '../../../utils/renderer';
import UiInteractionSupport from '../../../utils/uiInteractionSupport';
import {Store} from 'redux';

export class OrderTokenMenuRenderer {
    private _renderer: Renderer;

  init(store: Store<GameStoreState>, renderer: Renderer) {
        this._renderer = renderer;
    store.subscribe(() => {
      this.renderOrderTokenInMenu(store);
        });
    }

  private renderOrderTokenInMenu(store: Store<GameStoreState>) {
    const state = store.getState();
    if (state.gamePhase === GamePhase.PLANNING) {
      let availableOrderToken: OrderTokenType[] = StateSelectorService.getPlacableOrderTokenTypes(state, state.localPlayersHouse);
            this._renderer.displayOrderTokenInMenu(availableOrderToken, (sprite: Phaser.Sprite) => {
              this.placeOrderToken(store, sprite);
            });
        }
        else {
            this._renderer.hidePlaceAbleOrderToken();
        }
    }

  private placeOrderToken(store: Store<GameStoreState>, sprite) {
    const localPlayersHouse: House = store.getState().localPlayersHouse;
        AssetLoader.getAreaTokens().forEach((area: UiArea) => {
          if (UiInteractionSupport.intersects(this._renderer.game.camera, sprite, area) && StateSelectorService.isAllowedToPlaceOrderToken(store.getState(), localPlayersHouse, area.name)) {
            store.dispatch(ActionFactory.placeOrder(area.name, new OrderToken(localPlayersHouse, sprite.frame)));
            }
        });
    }
}
