import Renderer from '../../../utils/renderer';
import {GameLogic, StateSelectorService} from 'got-store';

export default class RecruitingRenderer {

  private renderer: Renderer;

  public init(gameLogic: GameLogic, renderer: Renderer) {
    this.renderer = renderer;
    this.highlightPossibleArea(gameLogic);
    gameLogic.subscribe(() => {
      this.highlightPossibleArea(gameLogic);
    });
  }

  private highlightPossibleArea(gameLogic: GameLogic) {
    const state = gameLogic.getState();
    if (state.areasAllowedToRecruit.length > 0 && state.localPlayersHouse === state.currentHouse) {

      const areasToRecruit = StateSelectorService.getAreasAllowedToRecruit(state, state.localPlayersHouse);
      if (areasToRecruit.length > 0) {
        areasToRecruit.forEach((area) => {
          let showModalFn = () => {
            this.renderer.showRecruitingModal(gameLogic, area);
          };
          this.renderer.drawRectangleAroundAreaName(area.key, 0xFF0000, showModalFn, this.renderer.areasToRecruit);
        });
      }
    }
  }
}
