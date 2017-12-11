import Renderer from '../../utils/renderer';
import RecruitingModal from './recruitingModal';
import RecruitingRules from '../../logic/board/gameRules/recruitingRules';
import {gameStore, GameStoreState} from '../../logic/board/gameState/reducer';
export default class RecruitingRenderer {

    private areasToRecruit: Phaser.Group;
    private game: Phaser.Game;

    public init(game: Phaser.Game) {
        this.game = game;
        this.areasToRecruit = this.game.add.group();
        gameStore.subscribe(() => {
            this.highlightPossibleArea(gameStore.getState());
        });
    }

    private highlightPossibleArea(state: GameStoreState) {

        if (state.areasAllowedToRecruit.length > 0 && state.localPlayersHouse === state.currentPlayer.house) {

            const areasToRecruit = RecruitingRules.getAreasAllowedToRecruit(state);
            if (areasToRecruit.length > 0) {
                areasToRecruit.forEach((area) => {
                    let showModalFn = () => {
                        let modal = new RecruitingModal(this.game, area, () => this.areasToRecruit.removeChildren());
                        modal.show();
                    };
                    Renderer.drawRectangleAroundAreaName(this.game, area.key, 0xFF0000, showModalFn, this.areasToRecruit);
                });
            }
        }
    }
}