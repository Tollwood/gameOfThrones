import Renderer from '../../../utils/renderer';
import {GameLogic, State} from 'got-store/dist';
import AssetLoader from '../../../utils/assetLoader';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export class OverlayRenderer {

  private renderer: Renderer;
  private overlay: Phaser.Sprite;

  public init(store: GameLogic, renderer: Renderer) {
    this.renderer = renderer;
    this.renderOverlay(store.getState());
    store.subscribe(() => {
      this.renderOverlay(store.getState());
    });
  }

  private renderOverlay(state: State) {
    if (this.overlay) {
      this.overlay.destroy();
    }
    this.overlay = this.renderer.game.add.sprite(0, 0, AssetLoader.HIGHLIGHT_3);
    if (window.innerWidth <= 1024) {
      this.overlay.scale.setTo(0.5);
      this.overlay.alpha = 0.2;
      this.overlay.tint = 0xFF0000;
    }
  }
}
