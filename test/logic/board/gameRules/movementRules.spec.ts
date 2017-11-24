import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {House} from '../../../../src/logic/board/house';
import {OrderTokenType} from '../../../../src/logic/orderToken/orderToken';
import {UnitType} from '../../../../src/logic/units/unitType';
import MovementRules from '../../../../src/logic/board/gameRules/movementRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import Unit from '../../../../src/logic/units/units';
import CombatResult from '../../../../src/logic/march/combatResult';
import {AreaKey} from '../../../../src/logic/board/areaKey';

describe('MovementRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });
    describe('isAllowedToMove', () => {
        it('should be allowed to move units from one area to another connected area', () => {
            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).addToGameState(gameState).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell).addToGameState(gameState).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([karhold])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            gameState.players = [new Player(House.stark, 5, [])];
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            // when
            let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

            // then
            expect(result).toBeTruthy();
        });
        it('should not be allowed to move units if areas are not connected via borders', () => {
            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).addToGameState(gameState).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell).addToGameState(gameState)
                .withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            gameState.players = [new Player(House.stark, 5, [])];
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            // when
            let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

            // then
            expect(result).toBeFalsy();
        });
        it('should not be allowed to move units if sourceArea has no Units', () => {
            // given
            let karhold = new AreaBuilder(AreaKey.Karhold).addToGameState(gameState).build();
            let winterfell = new AreaBuilder(AreaKey.Winterfell).addToGameState(gameState)
                .withHouse(House.stark)
                .withBorders([karhold])
                .withOrderToken(OrderTokenType.march_minusOne)
                .build();
            gameState.players = [new Player(House.stark, 5, [])];
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            // when
            let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

            // then
            expect(result).toBeFalsy();
        });
        it('should be allowed to move land units from WhiteHarbor via theShiveringsea using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).addToGameState(gameState).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea()
                .addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([theSiveringSea])
                .withOrderToken(OrderTokenType.march_minusOne)
                .addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.connectedUsingShipTransport(whiteHarbor, castleBlack);

            // then
            expect(result).toBeTruthy();
        });
        it('should be allowed to move land units from WhiteHarbor via two sea ereas using a friendly ship to castleBlack', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).addToGameState(gameState).build();
            let theSiveringSea = new AreaBuilder(AreaKey.TheShiveringSea).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .isSeaArea().addToGameState(gameState).build();

            let theStonyShore = new AreaBuilder(AreaKey.TheStonyShore).withHouse(House.stark)
                .withUnits([UnitType.Ship])
                .withBorders([theSiveringSea])
                .isSeaArea()
                .addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor)
                .withHouse(House.stark).withUnits([UnitType.Footman])
                .withBorders([theStonyShore])
                .withOrderToken(OrderTokenType.march_minusOne)
                .addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.connectedUsingShipTransport(whiteHarbor, castleBlack);

            // then
            expect(result).toBeTruthy();
        });
        it('should be allowed to move unit into an enemy area with establish control of other player', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon).addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, []), new Player(House.baratheon, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

            // then
            expect(result).toBeTruthy();
        });
        it('should be allowed to move units into an occupied area', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.baratheon)
                .withUnits([UnitType.Footman]).addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman]).withBorders([castleBlack]).withOrderToken(OrderTokenType.march_minusOne)
                .addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, []), new Player(House.baratheon, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

            // then
            expect(result).toBeTruthy();
        });
        it('should not move land unit into a sea area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).isSeaArea().addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark)
                .withUnits([UnitType.Footman])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

            // then
            expect(result).toBeFalsy();
        });
        it('should not move sea unit into a land area ', () => {
            // given
            let castleBlack = new AreaBuilder(AreaKey.CastleBlack).addToGameState(gameState).build();
            let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Ship])
                .withBorders([castleBlack])
                .withOrderToken(OrderTokenType.march_minusOne)
                .isSeaArea().addToGameState(gameState).build();
            gameState.players = [new Player(House.stark, 5, [])];
            // when
            GameRules.load(gameState);
            SupplyRules.updateSupply();
            let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

            // then
            expect(result).toBeFalsy();

        });
    });

    describe('shouldEstablishControl', () => {
        it('should reduce PowerToken by one and establish control', () => {
            // given
            const playerStark = new Player(House.stark, 1, []);
            const winterfell = new AreaBuilder(AreaKey.Winterfell).build();
            gameState.areas.push(winterfell);
            gameState.players = [playerStark];
            GameRules.load(gameState);

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
            gameState.areas.push(winterfell);
            gameState.players = [playerStark];
            GameRules.load(gameState);

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
            const unitsToMove = [footmanUnit1, horseUnit];
            const completeOrder = false;
            const establishControl = false;
            gameState.areas.push(sourceArea, targetArea);
            GameRules.load(gameState);

            // when
            MovementRules.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(targetArea.units).toEqual(unitsToMove);
            expect(targetArea.controllingHouse).toBe(House.stark);
            expect(sourceArea.units).toEqual([footmanUnit2]);
            expect(sourceArea.controllingHouse).toBe(House.stark);
            expect(sourceArea.orderToken).toBeDefined();
            expect(sourceArea.orderToken.getType()).toBeDefined(OrderTokenType.march_special);
        });
        it('should set controllingHouse to null if all units leave source area', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const unitsToMove = [horseUnit];
            const completeOrder = false;
            const establishControl = false;
            gameState.areas.push(sourceArea, targetArea);
            GameRules.load(gameState);

            // when
            MovementRules.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(sourceArea.controllingHouse).toBeNull();
        });
        it('should set the orderToken to null incase order is complete', () => {
            // given
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const unitsToMove = [horseUnit];
            gameState.areas.push(sourceArea, targetArea);
            GameRules.load(gameState);

            // when
            MovementRules.moveUnits(sourceArea.key, targetArea.key, unitsToMove);

            // then
            expect(sourceArea.orderToken).toBeNull();
        });
        it('should establish control if order is complete and establishControl is true', () => {
            // given
            const player = new Player(House.stark, 1, []);
            gameState.players.push(player);
            const horseUnit = new Unit(UnitType.Horse, House.stark);
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
            sourceArea.units = [horseUnit];
            const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
            const unitsToMove = [horseUnit];
            const completeOrder = true;
            const establishControl = true;
            gameState.areas.push(sourceArea, targetArea);
            GameRules.load(gameState);

            // when
            MovementRules.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl);

            // then
            expect(sourceArea.controllingHouse).toBe(House.stark);
            expect(player.powerToken).toBe(0);
        });
    });

    describe('getAllAreasAllowedToMarchTo', () => {
        it('should return empty Array if no units are present in sourceArea', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).build();
            const actual = MovementRules.getAllAreasAllowedToMarchTo(sourceArea);
            expect(actual.length).toBe(0);
        });
        it('should verify all areas if a move is possible', () => {
            const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).build();
            const whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).build();
            gameState.areas.push(sourceArea, whiteHarbor);
            GameRules.load(gameState);
            spyOn(MovementRules, 'isAllowedToMove').and.returnValue(false);
            const actual = MovementRules.getAllAreasAllowedToMarchTo(sourceArea);
            expect(actual.length).toBe(0);
            expect(MovementRules.isAllowedToMove).toHaveBeenCalledWith(sourceArea, sourceArea, sourceArea.units[0]);
            expect(MovementRules.isAllowedToMove).toHaveBeenCalledWith(sourceArea, whiteHarbor, sourceArea.units[0]);
        });
    });

    describe('resolveFight', () => {
        it('should eliminate defenders army and establish control over attacking area if attacker wins', () => {
            // given
            const attackingArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).build();
            const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
            const playerStark = new Player(House.stark, 1, []);
            gameState.players = [playerStark];
            const combatResult = new CombatResult(attackingArea, defendingArea, 2, 1);

            gameState.areas.push(attackingArea, defendingArea);
            GameRules.load(gameState);
            // when
            MovementRules.resolveFight(combatResult);

            // then
            expect(defendingArea.controllingHouse).toBe(House.stark);
            expect(attackingArea.controllingHouse).toBe(House.stark);
            expect(defendingArea.orderToken).toBeNull();
            expect(attackingArea.orderToken).toBeNull();
            expect(attackingArea.units.length).toBe(0);
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


