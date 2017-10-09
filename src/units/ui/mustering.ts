import GameRules from '../../board/logic/gameRules';
import GameState from '../../board/logic/gameStati';
import Renderer from '../../utils/renderer';
export default class Mustering {

    public static highlightPossibleArea(game: Phaser.Game) {
        let allAreasForMustering = GameRules.getAllAreasForMustering(GameState.getInstance().currentPlayer.house);
        allAreasForMustering.forEach((area) => {
            let showModalFn = () => {

            };

            Renderer.drawRectangleAroundAreaName(game, area.key, 0xFF0000, showModalFn);
        });
    }
}