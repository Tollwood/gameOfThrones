import AreaBuilder from '../../../areaBuilder';
import AreaRules from '../../../../src/board/logic/gameRules/AreaRules';
import GameState from '../../../../src/board/logic/gameState/GameState';
import GameRules from '../../../../src/board/logic/gameRules/gameRules';

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
        let karhold = new AreaBuilder('Karhold').withHouse(House.stark).addToGameState(gameState).withSupply(1).withCastle().build();
        GameRules.load(gameState);
        //when
        let actual = AreaRules.isConnectedArea(winterfell, karhold);

        //then
        expect(actual).toBeTruthy();

    });


});