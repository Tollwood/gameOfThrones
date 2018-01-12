import AreaBuilder from '../../../areaBuilder';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {loadGame} from '../../../../src/logic/board/gameState/actions';
import Player from '../../../../src/logic/board/player';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {GamePhase} from '../../../../src/logic/board/gamePhase';

xdescribe('NextPhaseAction', () => {
    it('should increase power for all player owning areas with consolidate power symbols and give one additional power for each token', () => {
        const playerStark = new Player(House.stark, 0, []);
        const playerLannister = new Player(House.lannister, 0, []);
        // given
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).withOrderToken(OrderTokenType.consolidatePower_1).build();
        const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withConsolidatePower(2).withOrderToken(OrderTokenType.consolidatePower_0).build();
        const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withConsolidatePower(1).withOrderToken(OrderTokenType.consolidatePower_special).build();

        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.CastleBlack, castleBlack);
        areas.set(AreaKey.WhiteHarbor, whiteHarbor);

        let gameStoreState = {
            ironThroneSuccession: [House.stark, House.lannister],
            gamePhase: GamePhase.ACTION_CLEANUP,
            players: [playerStark, playerLannister],
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        // gameStore.dispatch(nextPhase());
        const newState = gameStore.getState();

        // then
        expect(newState.players.filter(player => player.house === House.stark)[0].powerToken).toBe(5);
        expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.WhiteHarbor).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.CastleBlack).orderToken).toBeNull();
        expect(newState.players.filter(player => player.house === House.lannister)[0].powerToken).toBe(2);
    });

    it('should not increase power if no consolidate power token exist in area', () => {

        // given
        const playerStark = new Player(House.stark, 0, []);
        const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withConsolidatePower(1).withOrderToken(OrderTokenType.raid_0).build();

        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);

        let gameStoreState = {
            ironThroneSuccession: [House.stark],
            gamePhase: GamePhase.ACTION_CLEANUP,
            players: [playerStark],
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));

        // when
        //  gameStore.dispatch(nextPhase());
        const newState = gameStore.getState();

        // then
        expect(playerStark.powerToken).toBe(0);
    });

    it('should return the house with most strongholds/castle after round 10 was completed', () => {
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withStronghold().withHouse(House.stark).build();
        let whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withStronghold().withHouse(House.lannister).build();
        let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withStronghold().withHouse(House.lannister).build();

        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.WhiteHarbor, whiteHarbour);
        areas.set(AreaKey.CastleBlack, castleBlack);
        const gameStoreState = {
            gameRound: 10,
            gamePhase: GamePhase.ACTION_CLEANUP,
            ironThroneSuccession: [House.stark, House.lannister],
            players: [new Player(House.stark, 0, []), new Player(House.lannister, 0, [])],
            areas: areas
        };
        gameStore.dispatch(loadGame(gameStoreState));
        //  gameStore.dispatch(nextPhase());
        expect(gameStore.getState().winningHouse).toBe(House.lannister);
    });

    it('should switch to first player', () => {
        const initialState = {
            areas: new TSMap<AreaKey, Area>(),
            players: [],
            ironThroneSuccession: [House.lannister, House.stark]
        };
        gameStore.dispatch(loadGame(initialState));
        //      gameStore.dispatch(nextPhase());

        // then
        const newState = gameStore.getState();
        expect(newState.currentHouse).toBe(House.lannister);
    });
});