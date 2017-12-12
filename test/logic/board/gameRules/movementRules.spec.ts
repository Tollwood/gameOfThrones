import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import MovementRules from '../../../../src/logic/board/gameRules/movementRules';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import Unit from '../../../../src/logic/units/units';
import CombatResult from '../../../../src/logic/march/combatResult';
import {AreaKey} from '../../../../src/logic/board/areaKey';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderTokenType';
import {loadGame} from '../../../../src/logic/board/gameState/actions';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {TSMap} from 'typescript-map';
import {Area} from '../../../../src/logic/board/area';

describe('MovementRules', () => {

    const playerLannister = new Player(House.lannister, 0, []);
    const playerStark = new Player(House.stark, 1, []);

    describe('getAllAreasAllowedToMarchTo', () => {

        it('should return empty Array if no units are present in sourceArea', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            const actual = MovementRules.getAllAreasAllowedToMarchTo(state, sourceArea);
            expect(actual.length).toBe(0);
        });

        it('should return no valid areas if source area has no units', () => {
            // given
            const area = new AreaBuilder(AreaKey.Winterfell).withBorders([]).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, area);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            const actual = MovementRules.getAllAreasAllowedToMarchTo(state, area);
            // then
            expect(actual.length).toBe(0);
        });
        it('should be allowed to move units from one area to an unoccupied border area', () => {
            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([karhold])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Karhold, karhold);
            areas.set(AreaKey.Winterfell, winterfell);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, winterfell);

            // then
            expect(SupplyRules.enoughSupplyForArmySize).toHaveBeenCalledWith(state, winterfell, karhold);
            expect(result.length).toBe(1);
            expect(result.indexOf(karhold)).toBeGreaterThan(-1);
        });

        it('should be allowed to move land units from WhiteHarbor via theShiveringsea using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea()
                .build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([theSiveringSea])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            areas.set(AreaKey.TheShiveringSea, theSiveringSea);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(SupplyRules.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should be allowed to move land units from WhiteHarbor via two sea areas using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea().build();

            let theStonyShore = new AreaBuilder(AreaKey.TheStonyShore).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([theSiveringSea])
                .isSeaArea()
                .build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark).withUnits([UnitType.Footman])
                .withBorders([theStonyShore])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            areas.set(AreaKey.TheShiveringSea, theSiveringSea);
            areas.set(AreaKey.TheStonyShore, theStonyShore);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(SupplyRules.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);

        });
        it('should be allowed to move unit into an enemy area with establish control of other player', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(SupplyRules.enoughSupplyForArmySize).toHaveBeenCalledWith(state, whiteHarbor, castleBlack);
            expect(result.length).toBe(1);
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should be allowed to move units into an occupied area', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon)
                .withUnits([UnitType.Footman]).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman]).withBorders([castleBlack]).withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBeGreaterThan(-1);
        });
        it('should not move land unit into a sea area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).isSeaArea().build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            spyOn(SupplyRules, 'enoughSupplyForArmySize').and.returnValue(true);
            let state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBe(-1);
        });
        it('should not move sea unit into a land area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .isSeaArea().build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.WhiteHarbor, whiteHarbor);
            areas.set(AreaKey.CastleBlack, castleBlack);
            const currentlyAllowedSupply = new TSMap<House, number>();
            currentlyAllowedSupply.set(House.stark, 1);
            const state = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas,
                currentlyAllowedSupply
            };
            // when
            let result = MovementRules.getAllAreasAllowedToMarchTo(state, whiteHarbor);

            // then
            expect(result.indexOf(castleBlack)).toBe(-1);

        });
    });

    describe('shouldEstablishControl', () => {
        it('should reduce PowerToken by one and establish control', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            const playerStark = new Player(House.stark, 1, []);
            let gameStoreState = {players: [playerStark], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            MovementRules['establishControl'](winterfell, House.stark);

            // then
            expect(winterfell.controllingHouse).toBe(House.stark);
            expect(playerStark.powerToken).toBe(0);
        });
        it('should not establish control if House has no power token', () => {
            // given
            const playerStark = new Player(House.stark, 0, []);
            const winterfell = new AreaBuilder(AreaKey.Winterfell).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, winterfell);
            let gameStoreState = {players: [playerStark], areas: areas};
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            MovementRules['establishControl'](winterfell, House.stark);

            // then
            expect(winterfell.controllingHouse).toBeNull();
            expect(playerStark.powerToken).toBe(0);
        });
    });

    describe('moveUnits', () => {
        it('should move the units and establish control in targetArea', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const footmanUnit1 = new Unit(UnitType.Footman, House.stark);
            const footmanUnit2 = new Unit(UnitType.Footman, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit, footmanUnit1, footmanUnit2];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            const unitsToMove = [footmanUnit1, horseUnit];
            const completeOrder = false;
            const establishControl = false;
            let gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            const actual = MovementRules.moveUnits(areas.values(), sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(actual).not.toBe(areas);

            expect(actual.get(targetArea.key).units).toEqual(unitsToMove);
            expect(actual.get(targetArea.key).controllingHouse).toBe(House.stark);
            expect(actual.get(sourceArea.key).units).toEqual([footmanUnit2]);
            expect(actual.get(sourceArea.key).controllingHouse).toBe(House.stark);
            expect(actual.get(sourceArea.key).orderToken).toBeDefined();
            expect(actual.get(sourceArea.key).orderToken.getType()).toBeDefined(OrderTokenType.march_special);
        });
        it('should set controllingHouse to null if all units leave source area', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            const unitsToMove = [horseUnit];
            const completeOrder = false;
            const establishControl = false;
            let gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            const actual = MovementRules.moveUnits(areas.values(), sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(actual.get(sourceArea.key).controllingHouse).toBeNull();
        });
        it('should set the orderToken to null incase order is complete', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            const unitsToMove = [horseUnit];
            let gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            const actual = MovementRules.moveUnits(areas.values(), sourceArea.key, targetArea.key, unitsToMove);

            // then
            expect(actual.get(sourceArea.key).orderToken).toBeNull();
        });
        it('should establish control if order is complete and establishControl is true', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, sourceArea);
            areas.set(AreaKey.WhiteHarbor, targetArea);
            const unitsToMove = [horseUnit];
            const completeOrder = true;
            const establishControl = true;
            let gameStoreState = {
                ironThroneSuccession: [playerLannister.house, playerStark.house],
                players: [playerStark, playerLannister],
                currentHouse: House.stark,
                areas: areas
            };
            gameStore.dispatch(loadGame(gameStoreState));

            // when
            const actual = MovementRules.moveUnits(areas.values(), sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(actual.get(sourceArea.key).controllingHouse).toBe(House.stark);
            // TODO immutable - should not be modified directly
            expect(gameStore.getState().players.filter(player => player.house === House.stark)[0].powerToken).toBe(0);
        });
    });

    describe('resolveFight', () => {
        it('should eliminate defenders army and establish control over attacking area if attacker wins', () => {
            // given
            const attackingArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).build();
            const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            const playerStark = new Player(House.stark, 5, []);
            const players = [playerStark, new Player(House.lannister, 5, [])];
            const ironThroneSuccession = [House.lannister, House.stark];
            const areas = new TSMap<AreaKey, Area>();
            areas.set(AreaKey.Winterfell, attackingArea);
            areas.set(AreaKey.WhiteHarbor, defendingArea);

            const gameStoreState = {
                areas: areas,
                players,
                ironThroneSuccession,
                currentHouse: House.stark
            };
            gameStore.dispatch(loadGame(gameStoreState));
            const combatResult = new CombatResult(attackingArea, defendingArea, 2, 1);

            // when
            MovementRules.resolveFight(combatResult);

            const currenState = gameStore.getState();
            const newDefendingArea = currenState.areas.get(defendingArea.key);
            const newAttackingArea = currenState.areas.get(attackingArea.key);
            // then
            expect(newDefendingArea.controllingHouse).toBe(House.stark);
            expect(newDefendingArea.orderToken).toBeNull();
            expect(newAttackingArea.controllingHouse).toBe(House.stark);
            expect(newAttackingArea.orderToken).toBeNull();
            expect(newAttackingArea.units.length).toBe(0);
        });
        it('it should elimite attackers army, remove its control over attacking area and remove order Token if defender wins', () => {
            // given
            const attackingArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
            const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withUnits([UnitType.Horse]).build();
            const combatResult = new CombatResult(attackingArea, defendingArea, 1, 2);


            // when
            MovementRules.resolveFight(combatResult);

            // then
            expect(attackingArea.units.length).toBe(0);
            expect(attackingArea.orderToken).toBeNull();
            expect(attackingArea.controllingHouse).toBeNull();
            expect(defendingArea.units.length).toBe(1);

        });
    });

});


