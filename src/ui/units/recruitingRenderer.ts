import GameRules from '../../logic/board/gameRules/gameRules';

import Renderer from '../../utils/renderer';
import RecruitingModal from './recruitingModal';
import RecruitingRules from '../../logic/board/gameRules/recruitingRules';
import {gameStore} from '../../logic/board/gameState/reducer';
export default class RecruitingRenderer {

    private static areasToRecruit: Phaser.Group;

    public static createGroups(game: Phaser.Game) {
        this.areasToRecruit = game.add.group();
    }

    public static highlightPossibleArea(game: Phaser.Game): number {
        this.areasToRecruit.removeChildren();
        let areasAllowedToRecruit = RecruitingRules.getAreasAllowedToRecruit(gameStore.getState().currentPlayer.house);
        areasAllowedToRecruit.forEach((area) => {
            let showModalFn = () => {
                let modal = new RecruitingModal(game, area);
                modal.show();
            };

            Renderer.drawRectangleAroundAreaName(game, area.key, 0xFF0000, showModalFn, this.areasToRecruit);
        });
        return areasAllowedToRecruit.length;
    }

    public  static removeChildren() {
        this.areasToRecruit.removeChildren();

    }
}