import GameRules from '../../../../src/board/logic/gameRules/gameRules';
import {House} from '../../../../src/board/logic/house';
import {OrderTokenType} from '../../../../src/orderToken/logic/orderToken';
import {UnitType} from '../../../../src/units/logic/unitType';
import MovementRules from '../../../../src/board/logic/gameRules/movementRules';
import GameState from '../../../../src/board/logic/gameState/GameState';
import SupplyRules from '../../../../src/board/logic/gameRules/supplyRules';
import Player from '../../../../src/board/logic/player';
import TestUtil from '../../../testUtil';
import Order = jasmine.Order;

describe('MovementRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should be allowed to move units from one area to another connected area', () => {
        // given
        let karhold = TestUtil.defineArea(gameState, 'Karhold', null, [], [], null);
        let winterfell = TestUtil.defineArea(gameState, 'Winterfell', House.stark, [UnitType.Footman], [karhold], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        //when
        let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

        //then
        expect(result).toBeTruthy();
    });

    it('should not be allowed to move units if areas are not connected via borders', () => {
        // given
        let karhold = TestUtil.defineArea(gameState, 'Karhold', null, [], [], null);
        let winterfell = TestUtil.defineArea(gameState, 'Winterfell', House.stark, [UnitType.Footman], [], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        //when
        let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

        //then
        expect(result).toBeFalsy();
    });

    it('should not be allowed to move units if sourceArea has no Units', () => {
        // given
        let karhold = TestUtil.defineArea(gameState, 'Karhold', null, [], [], null);
        let winterfell = TestUtil.defineArea(gameState, 'Winterfell', House.stark, [], [karhold], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        //when
        let result = MovementRules.isAllowedToMove(winterfell, karhold, winterfell.units[0]);

        //then
        expect(result).toBeFalsy();
    });

    it('should be allowed to move land units from WhiteHarbor via theShiveringsea using a friendly ship to castleBlack', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', null, [], [], undefined);
        let theSiveringSea = TestUtil.defineArea(gameState, 'TheShiveringSea', House.stark, [UnitType.Ship], [castleBlack], null, false);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman], [theSiveringSea], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.connectedUsingShipTransport(whiteHarbor, castleBlack);

        //then
        expect(result).toBeTruthy();
    });

    it('should be allowed to move land units from WhiteHarbor via two sea ereas using a friendly ship to castleBlack', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', null, [], [], undefined);
        let theSiveringSea = TestUtil.defineArea(gameState, 'TheShiveringSea', House.stark, [UnitType.Ship], [castleBlack], null, false);
        let theStonyShore = TestUtil.defineArea(gameState, 'TheStonyShore', House.stark, [UnitType.Ship], [theSiveringSea], null, false);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman], [theStonyShore], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.connectedUsingShipTransport(whiteHarbor, castleBlack);

        //then
        expect(result).toBeTruthy();
    });

    it('should be allowed to move unit into an enemy area with establish control of other player', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', House.baratheon, [], [], undefined);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman], [castleBlack], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, []), new Player(House.baratheon, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

        //then
        expect(result).toBeTruthy();
    });

    it('should not be allowed to move units into an occupied area', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', House.baratheon, [UnitType.Footman], [], undefined);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman], [castleBlack], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, []), new Player(House.baratheon, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

        //then
        expect(result).toBeFalsy();
    });

    it('should not move land unit into a sea area ', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', null, [], [], undefined, false);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman], [castleBlack], OrderTokenType.march_minusOne);
        gameState.players = [new Player(House.stark, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

        //then
        expect(result).toBeFalsy();
    });

    it('should not move sea unit into a land area ', () => {
        // given
        let castleBlack = TestUtil.defineArea(gameState, 'CastleBlack', null, [], [], undefined);
        let whiteHarbor = TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Ship], [castleBlack], OrderTokenType.march_minusOne, false);
        gameState.players = [new Player(House.stark, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

        //then
        expect(result).toBeFalsy();

    });

});


