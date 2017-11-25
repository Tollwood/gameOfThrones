import GameRules from '../board/gameRules/gameRules';
import {OrderToken} from '../orderToken/orderToken';
import {Area} from '../board/area';
import {House} from '../board/house';
import {GamePhase} from '../board/gamePhase';
import Player from '../board/player';
import HousecCard from '../cards/houseCard';
import AiCalculator from './aiCalculator';
import TokenPlacementRules from '../board/gameRules/tokenPlacementRules';
import MovementRules from '../board/gameRules/movementRules';
import RecruitingRules from '../board/gameRules/recruitingRules';
import GameState from '../board/gameState/GameState';
export default class AiPlayer extends Player {

    private _AiCalculator: AiCalculator;

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);
        this._AiCalculator = new AiCalculator();

    }

    public placeAllOrderTokens() {
        let availableOrderToken = TokenPlacementRules.getPlacableOrderTokenTypes(this.house);
        let areasToPlaceAToken = GameRules.gameState.areas.filter((area) => {
            return TokenPlacementRules.isAllowedToPlaceOrderToken(this.house, area.key);
        });
        // TODO: consider already placed token when calculating further best moves
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return this._AiCalculator.getBestMove(this.house, area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            TokenPlacementRules.addOrderToken(new OrderToken(this.house, bestMove.orderTokenType), bestMove.sourceArea.key);
        }
    }

    public executeOrder(gameState: GameState) {

        if (gameState.gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = AiCalculator.getAreasForHouseWithToken(gameState.areas, this.house, TokenPlacementRules.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                // TODO: Pick most important moveToken first
                let sourceArea = areasWithMoveToken[0];
                let bestMove = this._AiCalculator.getBestMove(this.house, sourceArea, [sourceArea.orderToken.getType()]);

                if (bestMove === null) {
                    TokenPlacementRules.skipOrder(sourceArea.key);
                    return;
                }
                if (bestMove.targetArea !== null) {
                    MovementRules.moveUnits(sourceArea.key, bestMove.targetArea.key, sourceArea.units, true, this.shouldEstablishControl(sourceArea));
                    return;
                }
            }
        }

        if (gameState.gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = AiCalculator.getAreasForHouseWithToken(gameState.areas, this.house, TokenPlacementRules.RAID_ORDER_TOKENS);
            // TODO add logic to Execute RAID Order
            if (areasWithRaidToken.length > 0) {
                TokenPlacementRules.skipOrder(areasWithRaidToken[0].key);
            }
        }


    }

    public recruit() {
        const areas = RecruitingRules.getAreasAllowedToRecruit(this.house);
        areas.filter((a) => {
            return this.house === a.controllingHouse;
        }).forEach((area) => {
            // TODO: Add Logic to recruit new units
            RecruitingRules.recruit(area);
        });
    }

    private shouldEstablishControl(sourceArea: Area): boolean {
        return (sourceArea.units.length === 0 && (sourceArea.hasCastleOrStronghold() || sourceArea.supply > 0 || sourceArea.consolidatePower > 0 ));
    }


}