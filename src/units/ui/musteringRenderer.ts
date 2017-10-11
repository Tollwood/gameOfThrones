import GameRules from '../../board/logic/gameRules';
import GameState from '../../board/logic/gameStati';
import Renderer from '../../utils/renderer';
import MusteringModal from './musteringModal';
export default class MusteringRenderer {

    private static areasToMuster: Phaser.Group;

    public static createGroups(game: Phaser.Game) {
        this.areasToMuster = game.add.group();
    }

    public static highlightPossibleArea(game: Phaser.Game) {
        this.areasToMuster.removeChildren();
        let allAreasForMustering = GameRules.getAllAreasForMustering(GameState.getInstance().currentPlayer.house);
        allAreasForMustering.forEach((area) => {
            let showModalFn = () => {
                MusteringModal.showModal(game, area,);
            };

            Renderer.drawRectangleAroundAreaName(game, area.key, 0xFF0000, showModalFn, this.areasToMuster);
        });
    }

    public  static removeChildren() {
        this.areasToMuster.removeChildren();

    }
}