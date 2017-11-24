import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import SupplyRules from '../../../../src/logic/board/gameRules/supplyRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import Player from '../../../../src/logic/board/player';
import AreaBuilder from '../../../areaBuilder';
import {AreaKey} from '../../../../src/logic/board/areaKey';

describe('SupplyRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should return the size of each army sorted by size', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).addToGameState(gameState).build();
        new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).addToGameState(gameState).build();
        new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman, UnitType.Footman]).addToGameState(gameState).build();

        GameRules.load(gameState);

        // when
        let actual = SupplyRules.getArmiesBySizeForHouse(House.stark);

        // then
        expect(actual).toEqual([4, 3, 2]);

    });

    it('should return 3 if house has one army of size 2 and supply 1', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman])
            .withSupply(1).addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no army and supply 1', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withSupply(1).addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 2 if house has one army of size 3 and supply 1', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman, UnitType.Footman]).withSupply(1)
            .addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        // then
        expect(actual).toEqual(2);
    });

    it('should return 3 if house has two armies of size 2 and supply 1', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withUnits([UnitType.Footman, UnitType.Footman]).withSupply(1)
            .addToGameState(gameState).build();
        new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman]).addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        // then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no armyies and supply 1', () => {

        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1)
            .addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        // when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        // then
        expect(actual).toEqual(3);
    });

    it('should return empty array for house with no army', () => {
        // given
        new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).withSupply(1).addToGameState(gameState).build();
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        expect(SupplyRules.getArmiesBySizeForHouse(House.stark)).toEqual([]);


    });

});