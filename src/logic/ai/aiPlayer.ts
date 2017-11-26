import {House} from '../board/house';
import Player from '../board/player';
import HousecCard from '../cards/houseCard';
export default class AiPlayer extends Player {

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);
    }

}