import GameRules from '../../../../src/board/logic/gameRules/gameRules';
import {House} from '../../../../src/board/logic/house';
import {OrderTokenType} from '../../../../src/orderToken/logic/orderToken';
import {UnitType} from '../../../../src/units/logic/unitType';
import MovementRules from '../../../../src/board/logic/gameRules/movementRules';
import GameState from '../../../../src/board/logic/gameState/GameState';
import SupplyRules from '../../../../src/board/logic/gameRules/supplyRules';
import Player from '../../../../src/board/logic/player';
import AreaBuilder from '../../../areaBuilder';
import Order = jasmine.Order;
import game = PIXI.game;

describe('MovementRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should be allowed to move units from one area to another connected area', () => {
        // given
        let karhold = new AreaBuilder('Karhold').addToGameState(gameState).build();
        let winterfell = new AreaBuilder('Winterfell').addToGameState(gameState).withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withBorders([karhold])
            .withOrderToken(OrderTokenType.march_minusOne)
            .build();
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
        let karhold = new AreaBuilder('Karhold').addToGameState(gameState).build();
        let winterfell = new AreaBuilder('Winterfell').addToGameState(gameState)
            .withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withOrderToken(OrderTokenType.march_minusOne)
            .build();
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
        let karhold = new AreaBuilder('Karhold').addToGameState(gameState).build();
        let winterfell = new AreaBuilder('Winterfell').addToGameState(gameState)
            .withHouse(House.stark)
            .withBorders([karhold])
            .withOrderToken(OrderTokenType.march_minusOne)
            .build();
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
        let castleBlack = new AreaBuilder('CastleBlack').addToGameState(gameState).build();
        let theSiveringSea = new AreaBuilder('TheShiveringSea').withHouse(House.stark).withUnits([UnitType.Ship])
            .withBorders([castleBlack])
            .isSeaArea()
            .addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor').withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withBorders([theSiveringSea])
            .withOrderToken(OrderTokenType.march_minusOne)
            .addToGameState(gameState).build();
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
        let castleBlack = new AreaBuilder('CastleBlack').addToGameState(gameState).build();
        let theSiveringSea = new AreaBuilder('TheShiveringSea').withHouse(House.stark)
            .withUnits([UnitType.Ship])
            .withBorders([castleBlack])
            .isSeaArea().addToGameState(gameState).build();

        let theStonyShore = new AreaBuilder('TheStonyShore').withHouse(House.stark)
            .withUnits([UnitType.Ship])
            .withBorders([theSiveringSea])
            .isSeaArea()
            .addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor')
            .withHouse(House.stark).withUnits([UnitType.Footman])
            .withBorders([theStonyShore])
            .withOrderToken(OrderTokenType.march_minusOne)
            .addToGameState(gameState).build();
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
        let castleBlack = new AreaBuilder('CastleBlack').withHouse(House.baratheon).addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor').withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withBorders([castleBlack])
            .withOrderToken(OrderTokenType.march_minusOne)
            .addToGameState(gameState).build();
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
        let castleBlack = new AreaBuilder('CastleBlack').withHouse(House.baratheon)
            .withUnits([UnitType.Footman]).addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor').withHouse(House.stark)
            .withUnits([UnitType.Footman]).withBorders([castleBlack]).withOrderToken(OrderTokenType.march_minusOne)
            .addToGameState(gameState).build();
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
        let castleBlack = new AreaBuilder('CastleBlack').isSeaArea().addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor').withHouse(House.stark)
            .withUnits([UnitType.Footman])
            .withBorders([castleBlack])
            .withOrderToken(OrderTokenType.march_minusOne)
            .addToGameState(gameState).build();
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
        let castleBlack = new AreaBuilder('CastleBlack').addToGameState(gameState).build();
        let whiteHarbor = new AreaBuilder('WhiteHarbor').withHouse(House.stark).withUnits([UnitType.Ship])
            .withBorders([castleBlack])
            .withOrderToken(OrderTokenType.march_minusOne)
            .isSeaArea().addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        //when
        GameRules.load(gameState);
        SupplyRules.updateSupply();
        let result = MovementRules.isAllowedToMove(whiteHarbor, castleBlack, whiteHarbor.units[0]);

        //then
        expect(result).toBeFalsy();

    });

});


