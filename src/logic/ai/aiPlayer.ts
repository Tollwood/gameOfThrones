import {House} from '../board/house';
import Player from '../board/player';
import HousecCard from '../cards/houseCard';
import {gameStore, GameStoreState} from '../board/gameState/reducer';
import GameState from '../board/gameState/GameState';
import GameRules from '../board/gameRules/gameRules';
import {nextPlayer, recruitUnits} from '../board/gameState/actions';
import AiCalculator from './aiCalculator';
import RecruitingRules from '../board/gameRules/recruitingRules';
export default class AiPlayer extends Player {

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);
        gameStore.subscribe(() => this.recruit(gameStore.getState()));
    }

    isAiPlayer(): boolean {
        return true;
    }

    recruit(state: GameStoreState) {
        if (state.areasAllowedToRecruit.length > 0 && state.currentPlayer.house === this.house) {
            if (RecruitingRules.getAreasAllowedToRecruit(state).length > 0) {
                let result = AiCalculator.recruit(state, this);
                if (result !== null) {
                    gameStore.dispatch(recruitUnits(result));
                }
            } else {
                gameStore.dispatch(nextPlayer());
            }

        }
    }
}