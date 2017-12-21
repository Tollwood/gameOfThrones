import {House} from '../board/house';
import Player from '../board/player';
import HousecCard from '../cards/houseCard';
import {recruitUnits} from '../board/gameState/actions';
import AiCalculator from './aiCalculator';
import {gameStore, GameStoreState} from '../board/gameState/reducer';
import StateSelectorService from '../board/gameRules/stateSelectorService';
import {GamePhase} from '../board/gamePhase';
export default class AiPlayer extends Player {

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);
        gameStore.subscribe(() => {
            const state = gameStore.getState();
            this.recruit(state);
            this.placeOrderToken(state);
            this.executeOrder(state);
        });
    }

    isAiPlayer(): boolean {
        return true;
    }

    private recruit(state: GameStoreState) {
        if (state.areasAllowedToRecruit.length > 0 && state.currentHouse === this.house) {
            if (StateSelectorService.getAreasAllowedToRecruit(state, this.house).length > 0) {
                let result = AiCalculator.recruit(state, this);
                if (result !== null) {
                    gameStore.dispatch(recruitUnits(result.key));
                }
            }

        }
    }

    private placeOrderToken(state: GameStoreState) {
        if (state.gamePhase === GamePhase.PLANNING) {
            AiCalculator.placeAllOrderTokens(state, this.house);
        }
    }

    private executeOrder(state: GameStoreState) {
        if (state.currentHouse === this.house && (state.gamePhase === GamePhase.ACTION_RAID || state.gamePhase === GamePhase.ACTION_MARCH)) {
            AiCalculator.executeOrder(state, this);
        }
    }
}