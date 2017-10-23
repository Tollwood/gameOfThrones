import GameRules from '../../../../src/board/logic/gameRules/gameRules';
import {House} from '../../../../src/board/logic/house';
import {UnitType} from '../../../../src/units/logic/unitType';
import SupplyRules from '../../../../src/board/logic/gameRules/supplyRules';
import GameState from '../../../../src/board/logic/gameState/GameState';
import TestUtil from '../../../testUtil';
import Player from '../../../../src/board/logic/player';
import Order = jasmine.Order;

describe('SupplyRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    it('should return the size of each army sorted by size', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [UnitType.Footman, UnitType.Footman], [], null);
        TestUtil.defineArea(gameState, 'Winterfell', House.stark, [UnitType.Footman, UnitType.Footman, UnitType.Footman], [], null);
        TestUtil.defineArea(gameState, 'WhiteHarbor', House.stark, [UnitType.Footman, UnitType.Footman, UnitType.Footman, UnitType.Footman], [], null);
        GameRules.load(gameState);
        //when
        let actual = SupplyRules.getArmiesBySizeForHouse(House.stark);

        //then
        expect(actual).toEqual([4, 3, 2]);

    });

    it('should return 3 if house has one army of size 2 and supply 1', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [UnitType.Footman, UnitType.Footman], [], null, true, 1);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        //when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        //then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no army and supply 1', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [], [], null, true, 1);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        //when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        //then
        expect(actual).toEqual(3);
    });

    it('should return 2 if house has one army of size 3 and supply 1', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [UnitType.Footman, UnitType.Footman, UnitType.Footman], [], null, true, 1);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        //when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        //then
        expect(actual).toEqual(2);
    });

    it('should return 3 if house has two armies of size 2 and supply 1', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [UnitType.Footman, UnitType.Footman], [], null, true, 1);
        TestUtil.defineArea(gameState, 'Winterfell', House.stark, [UnitType.Footman, UnitType.Footman], [], null, true);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        //when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        //then
        expect(actual).toEqual(3);
    });

    it('should return 3 if house has no armyies and supply 1', () => {

        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [], [], null, true, 1);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        //when
        let actual = SupplyRules.allowedMaxSizeBasedOnSupply(House.stark);

        //then
        expect(actual).toEqual(3);
    });

    it('should return empty array for house with no army', () => {
        // given
        TestUtil.defineArea(gameState, 'Karhold', House.stark, [], [], null, true, 1);
        gameState.players = [new Player(House.stark, 5, [])];
        GameRules.load(gameState);
        SupplyRules.updateSupply();

        expect(SupplyRules.getArmiesBySizeForHouse(House.stark)).toEqual([]);


    });

});