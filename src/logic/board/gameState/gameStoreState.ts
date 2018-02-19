import {AreaKey} from '../areaKey';
import {Area} from '../area';
import {GamePhase} from '../gamePhase';
import {House} from '../house';
import Player from '../player';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {WesterosCard} from '../../cards/westerosCard';

export class GameStoreState {
    areas?: Map<AreaKey, Area>;

    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;

    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    currentlyAllowedTokenTypes?: Array<OrderTokenType>;

    players?: Array<Player>;
    localPlayersHouse?: House;
    currentHouse?: House;
    currentlyAllowedSupply?: Map<House, number>;

    areasAllowedToRecruit?: AreaKey[];

    currentWesterosCard?: WesterosCard;
    westerosCards?: Map<GamePhase, WesterosCard[]>;
    wildlingsCount?: number;
}
