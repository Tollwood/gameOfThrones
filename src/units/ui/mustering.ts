import GameRules from '../../board/logic/gameRules';
import GameState from '../../board/logic/gameStati';
import Renderer from '../../utils/renderer';
import MusteringModal from './musteringModal';
export default class Mustering {

    public static highlightPossibleArea(game: Phaser.Game) {
        let allAreasForMustering = GameRules.getAllAreasForMustering(GameState.getInstance().currentPlayer.house);
        allAreasForMustering.forEach((area) => {
            let showModalFn = () => {
                MusteringModal.showModal(game, area);
            };

            Renderer.drawRectangleAroundAreaName(game, area.key, 0xFF0000, showModalFn);
        });
    }
}