import AreaBuilder from '../../../areaBuilder';
import AreaRules from '../../../../src/logic/board/gameRules/AreaRules';
import GameState from '../../../../src/logic/board/gameState/GameState';
import GameRules from '../../../../src/logic/board/gameRules/gameRules';
import {House} from '../../../../src/logic/board/house';

describe('RecruitingRules', () => {

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState();
    });

    /*public static setAreasAllowedToRecruit(areasForRecruiting: Array<Area> = GameRules.gameState.areas) {

     GameRules.gameState.areasAllowedToRecruit = areasForRecruiting.filter((area) => {
     return area.controllingHouse !== null
     && area.hasCastleOrStronghold()
     && SupplyRules.allowedMaxSizeBasedOnSupply(area.controllingHouse) > area.units.length;
     });
     */
    xit('should set areasAllowedToRecruit for all controlled areas with Castle', () => {

        // given
        let winterfell = new AreaBuilder('Karhold').withHouse(House.stark).addToGameState(gameState).withSupply(1).withCastle().build();
        let karhold = new AreaBuilder('Karhold').withHouse(House.stark).addToGameState(gameState).withSupply(1).withCastle().build();
        GameRules.load(gameState);
        // when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        // then
        expect(actual).toBeTruthy();

    });


});