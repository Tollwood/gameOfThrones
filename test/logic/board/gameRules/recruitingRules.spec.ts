import AreaBuilder from '../../../areaBuilder';
import AreaRules from '../../../../src/logic/board/gameRules/AreaRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {House} from '../../../../src/logic/board/house';
import {AreaKey} from '../../../../src/logic/board/areaKey';

describe('RecruitingRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    xit('should set areasAllowedToRecruit for all controlled areas with Castle', () => {

        // given
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).addToGameState(gameState).withSupply(1).withCastle().build();
        let karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).addToGameState(gameState).withSupply(1).withCastle().build();
        GameRules.load(gameState);
        // when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        // then
        expect(actual).toBeTruthy();

    });


});