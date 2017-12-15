import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {consolidateAllPower, loadGame} from '../../../../src/logic/board/gameState/actions';
import Player from '../../../../src/logic/board/player';

describe('consolidateAllPowerAction', () => {
    it('should increase power for all player owning areas with consolidate power symbols', () => {
        // given
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).build();
        const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withConsolidatePower(2).build();
        const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withConsolidatePower(1).build();

        const playerStark = new Player(House.stark, 0, []);
        const playerLannister = new Player(House.lannister, 0, []);

        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.CastleBlack, castleBlack);
        areas.set(AreaKey.WhiteHarbor, whiteHarbor);
        let gameStoreState = {
            players: [playerStark, playerLannister],
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        gameStore.dispatch(consolidateAllPower());
        const newState = gameStore.getState();
        const newPlayerStark = newState.players.filter(player => player.house === House.stark)[0];
        const newPlayerLannister = newState.players.filter(player => player.house === House.lannister)[0];
        // then
        expect(newPlayerStark).not.toBe(playerStark);
        expect(newPlayerStark.powerToken).toBe(3);
        expect(newPlayerLannister).not.toBe(playerLannister);
        expect(newPlayerLannister.powerToken).toBe(1);
    });
});
