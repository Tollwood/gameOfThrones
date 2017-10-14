import GameState from '../board/logic/gameStati';
import GameRules from '../board/logic/gameRules';
import {OrderToken} from '../orderToken/logic/orderToken';
import {Area} from '../board/logic/area';
import {House} from '../board/logic/house';
import {GamePhase} from '../board/logic/gamePhase';
import Player from '../board/logic/player';
import HousecCard from '../cards/logic/houseCard';
import AiCalculator from './aiCalculator';
export default class AiPlayer extends Player {

    constructor(house: House, powerToken: number, cards: HousecCard[]) {
        super(house, powerToken, cards);

    }

    public placeAllOrderTokens() {
        let availableOrderToken = GameRules.getAvailableOrderToken(this.house);
        let areasToPlaceAToken = GameState.getInstance().areas.filter((area) => {
            return GameRules.isAllowedToPlaceOrderToken(this.house, area.key);
        });
        // TODO: consider already placed token when calculating further best moves
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return AiCalculator.getBestMove(this, area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            GameRules.addOrderToken(new OrderToken(this.house, bestMove.orderTokenType), bestMove.sourceArea.key);
        }
    }

    public executeOrder(gamePhase: GamePhase) {

        if (gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = AiCalculator.getAreasWithToken(this.house, GameRules.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                // TODO: Pick most important moveToken first
                let sourceArea = areasWithMoveToken[0];
                let bestMove = AiCalculator.getBestMove(this, sourceArea, [sourceArea.orderToken.getType()]);

                if (bestMove === null) {
                    GameRules.skipOrder(sourceArea.key);
                    return;
                }
                if (bestMove.targetArea !== null) {
                    GameRules.moveUnits(sourceArea.key, bestMove.targetArea.key, sourceArea.units);
                    this.establishControl(sourceArea);
                    return;
                }
            }
        }

        if (gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = AiCalculator.getAreasWithToken(this.house, GameRules.RAID_ORDER_TOKENS);
            // TODO add logic to Execute RAID Order
            if (areasWithRaidToken.length > 0) {
                GameRules.skipOrder(areasWithRaidToken[0].key);
            }
        }


    }

    public recruit(areas: Area[]) {
        areas.filter((a) => {
            return this.house === a.controllingHouse;
        }).forEach((area) => {
            // TODO: Add Logic to recruit new units
            GameRules.recruit(area);
        });
    }

    public calculateValueForDefendingOrders(area: Area): number {
        let value = 0;
        area.borders.forEach((borderArea) => {
            let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== this.house && borderArea.units.length > 0;
            if (controlledByOtherPlayerWithEnemyUnits) {
                // TODO create value Map and add different AiPlayer difficulties appyling different values
                value += 0.1;
            }
        });
        return value;
    }

    public calculateValueForRaidOrders(area: Area) {

        let value = 0;
        area.borders.forEach((borderArea) => {
            let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== this.house && borderArea.units.length > 0;
            if (controlledByOtherPlayerWithEnemyUnits) {
                // TODO create value Map and add different AiPlayer difficulties appyling different values
                value += 0.1;
            }
        });
        return value;
    }

    public calculateValueForMarchOrders(sourceArea: Area, targetArea: Area) {
        let value = 0;
        let numberOfEnemiesAtBorder = sourceArea.borders.filter((borderArea) => {
            return AiCalculator.controlledByOtherPlayerWithEnemyUnits(borderArea, this.house);
        }).length;

        let noEnemies = AiCalculator.noEnemies(targetArea, this.house);
        if (targetArea.hasCastleOrStronghold() && noEnemies) {
            // TODO create value Map and add different AiPlayer difficulties appyling different values
            value += 0.9;
        }
        if (targetArea.supply > 0 && noEnemies) {
            value += (0.1 * targetArea.supply);
        }
        if (targetArea.consolidatePower > 0 && noEnemies) {
            value += (0.1 * targetArea.consolidatePower);
        }
        value -= (numberOfEnemiesAtBorder * 0.1);

        return value;
    }

    public calculateValueForConsolidatePowerOrder(area: Area): number {
        return 0.1;
    }

    public calculateValueForSupportOrder(area: Area): number {
        return 0;
    }

    private establishControl(sourceArea: Area) {
        if (sourceArea.units.length === 0 && (sourceArea.hasCastleOrStronghold() || sourceArea.supply > 0 || sourceArea.consolidatePower > 0 )) {
            GameRules.establishControl(sourceArea);
        }
    }


}