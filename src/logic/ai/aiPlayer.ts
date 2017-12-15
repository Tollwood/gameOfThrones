import {House} from '../board/house';
import Player from '../board/player';
import HousecCard from '../cards/houseCard';
import {nextPlayer, recruitUnits} from '../board/gameState/actions';
import AiCalculator from './aiCalculator';
import {gameStore, GameStoreState} from '../board/gameState/reducer';
import StateSelectorService from '../board/gameRules/stateSelectorService';
export default class AiPlayer extends Player {

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);
        gameStore.subscribe(() => this.recruit(gameStore.getState()));
    }

    isAiPlayer(): boolean {
        return true;
    }

    private recruit(state: GameStoreState) {
        if (state.areasAllowedToRecruit.length > 0 && state.currentHouse === this.house) {
            if (StateSelectorService.getAreasAllowedToRecruit(state).length > 0) {
                let result = AiCalculator.recruit(state, this);
                if (result !== null) {
                    gameStore.dispatch(recruitUnits(result.key));
                }
            } else {
                gameStore.dispatch(nextPlayer());
            }

        }
    }
}