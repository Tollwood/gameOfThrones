import {gameStore} from '../../logic/board/gameState/reducer';
import {WESTEROS_PHASES} from '../../logic/board/gamePhase';
import WesterosCardModal from './westerosCardModal';
import WesterosCardRules from '../../logic/board/gameRules/westerosCardRules';
import Renderer from '../../utils/renderer';
import {GameStoreState} from '../../logic/board/gameState/gameStoreState';

export class WesterosCardRenderer {
    private renderer: Renderer;

    init(renderer: Renderer) {
        this.renderer = renderer;
        gameStore.subscribe(() => {
            this.renderWesterosCard(gameStore.getState());
        });
    }

    private renderWesterosCard(state: GameStoreState) {
        if (state.currentWesterosCard === null && WESTEROS_PHASES.indexOf(state.gamePhase) > -1) {
            const card = WesterosCardRules.getNextCard(state);
            let modal = new WesterosCardModal(this.renderer, card);
            modal.show();
        }
    }
}
