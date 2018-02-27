import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {ActionFactory, GameLogic, GamePhase, House, OrderToken, OrderTokenType, StateSelectorService} from 'got-store';
import UiArea from '../../../utils/UiArea';
import AssetLoader from '../../../utils/assetLoader';
import Renderer from '../../../utils/renderer';
import UiInteractionSupport from '../../../utils/uiInteractionSupport';

export class OrderTokenMenuRenderer {
    private _renderer: Renderer;

  init(gameLogic: GameLogic, renderer: Renderer) {
        this._renderer = renderer;
    this.renderOrderTokenInMenu(gameLogic);
    gameLogic.subscribe(() => {
      this.renderOrderTokenInMenu(gameLogic);
        });
    }

  private renderOrderTokenInMenu(gameLogic: GameLogic) {
    const state = gameLogic.getState();
    if (state.gamePhase === GamePhase.PLANNING) {
      let availableOrderToken: OrderTokenType[] = StateSelectorService.getPlacableOrderTokenTypes(state, state.localPlayersHouse);
            this._renderer.displayOrderTokenInMenu(availableOrderToken, (sprite: Phaser.Sprite) => {
              this.placeOrderToken(gameLogic, sprite);
            });
        }
        else {
            this._renderer.hidePlaceAbleOrderToken();
        }
    }

  private placeOrderToken(gameLogic: GameLogic, sprite) {
    const localPlayersHouse: House = gameLogic.getState().localPlayersHouse;
        AssetLoader.getAreaTokens().forEach((area: UiArea) => {
          if (UiInteractionSupport.intersects(this._renderer.game.camera, sprite, area) && StateSelectorService.isAllowedToPlaceOrderToken(gameLogic.getState(), localPlayersHouse, area.name)) {
            gameLogic.execute(ActionFactory.placeOrder(area.name, new OrderToken(localPlayersHouse, sprite.frame)));
            }
        });
    }
}
