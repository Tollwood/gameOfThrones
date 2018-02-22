import Renderer from '../../../utils/renderer';
import {GameStoreState, StateSelectorService} from 'got-store';
import {Store} from 'redux';

export default class RecruitingRenderer {

  private renderer: Renderer;

  public init(store: Store<GameStoreState>, renderer: Renderer) {
    this.renderer = renderer;
    store.subscribe(() => {
      this.highlightPossibleArea(store);
    });
  }

  private highlightPossibleArea(store: Store<GameStoreState>) {
    const state = store.getState();
    if (state.areasAllowedToRecruit.length > 0 && state.localPlayersHouse === state.currentHouse) {

      const areasToRecruit = StateSelectorService.getAreasAllowedToRecruit(state, state.localPlayersHouse);
      if (areasToRecruit.length > 0) {
        areasToRecruit.forEach((area) => {
          let showModalFn = () => {
            this.renderer.showRecruitingModal(store, area);
          };
          this.renderer.drawRectangleAroundAreaName(area.key, 0xFF0000, showModalFn, this.renderer.areasToRecruit);
        });
      }
    }
  }
}
