import {TSMap} from 'typescript-map';
import {AreaKey} from '../areaKey';
import {Area} from '../area';
import {GamePhase} from '../gamePhase';
import {House} from '../house';
import Player from '../player';
import {OrderTokenType} from '../../orderToken/orderTokenType';
import {WesterosCard} from '../../cards/westerosCard';

export class GameStoreState {
    areas?: TSMap<AreaKey, Area>;
    gameRound?: number;
    gamePhase?: GamePhase;
    winningHouse?: House;
    fiefdom?: House[];
    kingscourt?: House[];
    ironThroneSuccession?: House[];
    wildlingsCount?: number;
    players?: Array<Player>;
    localPlayersHouse?: House;
    currentHouse?: House;
    currentlyAllowedTokenTypes?: Array<OrderTokenType>;
    currentlyAllowedSupply?: TSMap<House, number>;
    areasAllowedToRecruit?: AreaKey[];
    currentWesterosCard?: WesterosCard;
    westerosCards?: TSMap<GamePhase, WesterosCard[]>;
}