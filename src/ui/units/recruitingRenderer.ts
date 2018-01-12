import Renderer from '../../utils/renderer';
import {gameStore} from '../../logic/board/gameState/reducer';
import StateSelectorService from '../../logic/board/gameRules/stateSelectorService';
import {GameStoreState} from '../../logic/board/gameState/gameStoreState';

export default class RecruitingRenderer {

    private renderer: Renderer;

    public init(renderer: Renderer) {
        this.renderer = renderer;
        gameStore.subscribe(() => {
            this.highlightPossibleArea(gameStore.getState());
        });
    }

    private highlightPossibleArea(state: GameStoreState) {
        if (state.areasAllowedToRecruit.length > 0 && state.localPlayersHouse === state.currentHouse) {

            const areasToRecruit = StateSelectorService.getAreasAllowedToRecruit(state, state.localPlayersHouse);
            if (areasToRecruit.length > 0) {
                areasToRecruit.forEach((area) => {
                    let showModalFn = () => {
                        this.renderer.showRecruitingModal(area);
                    };
                    this.renderer.drawRectangleAroundAreaName(area.key, 0xFF0000, showModalFn, this.renderer.areasToRecruit);
                });
            }
        }
    }
}