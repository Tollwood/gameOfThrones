import GamePhaseService from '../../../src/logic/board/gamePhaseService';

describe('GamePhaseService', () => {

    describe('getNextGamePhase', () => {

    });

    describe('getNextPhaseAndPlayer', () => {
        // TODO add Tests cases

        it('should return localPlayer as next as long as he can place orders', () => {

        });

        it('should return first in ironThroneSuccession and raid action phase once all orders are placed and at least one raid token was placed', () => {

        });

        it('should return next in ironThroneSuccession who still has an raid token to place, if action is raid', () => {

        });

        it('should return first in ironThroneSuccession and march action phase once all orders are placed and no raid token was placed', () => {

        });

        it('should return next in ironThroneSuccession who still has an march token to place, if action is march', () => {

        });

        it('should return first in ironThroneSuccession and cleanup action phase once all orders are placed and neither raid nor march token was placed', () => {

        });

        it('should increase power for all player owning areas with consolidate power symbols and give one additional power for each token', () => {
            // const playerStark = new Player(House.stark, 0);
            // const playerLannister = new Player(House.lannister, 0);
            // // given
            // const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_1).build();
            // const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.stark).withOrderToken(OrderTokenType.consolidatePower_0).build();
            // const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withOrderToken(OrderTokenType.consolidatePower_special).build();
            //
            // const areas = new TSMap<AreaKey, Area>();
            // areas.set(AreaKey.Winterfell, winterfell);
            // areas.set(AreaKey.CastleBlack, castleBlack);
            // areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            //
            // let gameStoreState = {
            //     ironThroneSuccession: [House.stark, House.lannister],
            //     gamePhase: GamePhase.ACTION_CLEANUP,
            //     players: [playerStark, playerLannister],
            //     areas: areas
            // };
            //
            // // when
            // // gameStore.dispatch(nextPhase());
            // const newState = gameStore.getState();
            //
            // // then
            // expect(newState.players.filter(player => player.house === House.stark)[0].powerToken).toBe(5);
            // expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
            // expect(newState.areas.get(AreaKey.WhiteHarbor).orderToken).toBeNull();
            // expect(newState.areas.get(AreaKey.CastleBlack).orderToken).toBeNull();
            // expect(newState.players.filter(player => player.house === House.lannister)[0].powerToken).toBe(2);
        });


        it('should switch to first player after cleanup', () => {
            // const areas = new TSMap<AreaKey, Area>();
            // const initialState = {
            //     areas,
            //     players: [],
            //     ironThroneSuccession: [House.lannister, House.stark],
            //     gamePhase: GamePhase.ACTION_CLEANUP
            // };


            // then
            // expect(actual.currentHouse).toBe(House.lannister);
        });

        it('should return the house with most strongholds/castle after round 10 was completed', () => {
            // let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            // let whiteHarbour = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).build();
            // let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.lannister).build();
            //
            // const areas = new TSMap<AreaKey, Area>();
            // areas.set(AreaKey.Winterfell, winterfell);
            // areas.set(AreaKey.WhiteHarbor, whiteHarbour);
            // areas.set(AreaKey.CastleBlack, castleBlack);
            // const gameStoreState = {
            //     gameRound: 10,
            //     gamePhase: GamePhase.ACTION_CLEANUP,
            //     ironThroneSuccession: [House.stark, House.lannister],
            //     players: [new Player(House.stark, 0), new Player(House.lannister, 0)],
            //     areas: areas
            // };
            // //  gameStore.dispatch(nextPhase());
            // expect(gameStore.getState().winningHouse).toBe(House.lannister);
        });

        it('should not increase power if no consolidate power token exist in area', () => {

            // // given
            // const playerStark = new Player(House.stark, 0);
            // const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.raid_0).build();
            //
            // const areas = new TSMap<AreaKey, Area>();
            // areas.set(AreaKey.Winterfell, winterfell);
            //
            // let gameStoreState = {
            //     ironThroneSuccession: [House.stark],
            //     gamePhase: GamePhase.ACTION_CLEANUP,
            //     players: [playerStark],
            //     areas: areas
            // };
            //
            // // when
            // //  gameStore.dispatch(nextPhase());
            // const newState = gameStore.getState();
            //
            // // then
            // expect(playerStark.powerToken).toBe(0);
        });
    });
    describe('updateGamePhaseAfterRecruiting', () => {
        // it('should return next player in the order of ironThrone that can recruit', () => {
        //     // given
        //     const areas = new TSMap<AreaKey, Area>();
        //     areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build());
        //     areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).withUnits([UnitType.Footman]).build());
        //     const areaKey = AreaKey.Winterfell;
        //     const currentlyAllowedSupply = new TSMap<House, number>();
        //     currentlyAllowedSupply.set(House.stark, 3);
        //     currentlyAllowedSupply.set(House.lannister, 3);
        //     const state = {
        //         areas: areas,
        //         areasAllowedToRecruit: [AreaKey.Winterfell, AreaKey.Pyke],
        //         gamePhase: GamePhase.WESTEROS1,
        //         ironThroneSuccession: [House.stark, House.lannister],
        //         currentHouse: House.stark,
        //         currentlyAllowedSupply
        //     };
        //     // when
        //     const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
        //     // then
        //
        //     expect(actual.gamePhase).toBe(state.gamePhase);
        //     expect(actual.currentHouse).toBe(House.lannister);
        // });
        // it('should return first of ironThroneSuccsession and next GamePhase if noone can recruit', () => {
        //     // given
        //     const areas = new TSMap<AreaKey, Area>();
        //     areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build());
        //     areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).build());
        //     const areaKey = AreaKey.Winterfell;
        //     const currentlyAllowedSupply = new TSMap<House, number>();
        //     currentlyAllowedSupply.set(House.stark, 0);
        //     currentlyAllowedSupply.set(House.lannister, 0);
        //     const state = {
        //         areas: areas,
        //         areasAllowedToRecruit: [],
        //         gamePhase: GamePhase.WESTEROS1,
        //         ironThroneSuccession: [House.baratheon, House.stark, House.lannister],
        //         currentHouse: House.stark,
        //         currentlyAllowedSupply
        //     };
        //     // when
        //     const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
        //     // then
        //
        //     expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
        //     expect(actual.currentHouse).toBe(House.baratheon);
        // });
        // it('should return currentPlayer if he is the only one who can recruit', () => {
        //     // given
        //     const areas = new TSMap<AreaKey, Area>();
        //     areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build());
        //     areas.set(AreaKey.Pyke, new AreaBuilder(AreaKey.Pyke).withHouse(House.lannister).build());
        //     const areaKey = AreaKey.Winterfell;
        //     const currentlyAllowedSupply = new TSMap<House, number>();
        //     currentlyAllowedSupply.set(House.stark, 0);
        //     currentlyAllowedSupply.set(House.lannister, 0);
        //     const state = {
        //         areas: areas,
        //         areasAllowedToRecruit: [AreaKey.Winterfell],
        //         gamePhase: GamePhase.WESTEROS1,
        //         ironThroneSuccession: [House.baratheon, House.stark, House.lannister],
        //         currentHouse: House.stark,
        //         currentlyAllowedSupply
        //     };
        //     // when
        //     const actual = GamePhaseService.updateGamePhaseAfterRecruiting(state, areaKey);
        //     // then
        //
        //     expect(actual.gamePhase).toBe(state.gamePhase);
        //     expect(actual.currentHouse).toBe(House.stark);
        // });
    });
});