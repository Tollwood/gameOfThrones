import GameRules from '../../board/logic/gameRules';
import GameState from '../../board/logic/gameStati';
import Renderer from '../../utils/renderer';
import RecruitingModal from './recruitingModal';
export default class RecruitingRenderer {

    private static areasToRecruit: Phaser.Group;

    public static createGroups(game: Phaser.Game) {
        this.areasToRecruit = game.add.group();
    }

    public static highlightPossibleArea(game: Phaser.Game): number {
        this.areasToRecruit.removeChildren();
        let areasAllowedToRecruit = GameRules.getAreasAllowedToRecruit(GameState.getInstance().currentPlayer.house);
        areasAllowedToRecruit.forEach((area) => {
            let showModalFn = () => {
                RecruitingModal.showModal(game, area);
            };

            Renderer.drawRectangleAroundAreaName(game, area.key, 0xFF0000, showModalFn, this.areasToRecruit);
        });
        return areasAllowedToRecruit.length;
    }

    public  static removeChildren() {
        this.areasToRecruit.removeChildren();

    }
}