import {Area} from '../board/area';
import {House} from '../board/house';
import PossibleMove from './possibleMove';
import MovementRules from '../board/gameRules/movementRules';
import {OrderTokenType} from '../orderToken/orderTokenType';
import {GamePhase} from '../board/gamePhase';
import TokenPlacementRules from '../board/gameRules/tokenPlacementRules';
import AiPlayer from './aiPlayer';
import RecruitingRules from '../board/gameRules/recruitingRules';
import {OrderToken} from '../orderToken/orderToken';
import {gameStore} from '../board/gameState/reducer';
export default class AiCalculator {

    public executeOrder(aiPlayer: AiPlayer) {

        if (gameStore.getState().gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = this.getAreasForHouseWithToken(gameStore.getState().areas, aiPlayer.house, TokenPlacementRules.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                // TODO: Pick most important moveToken first
                let sourceArea = areasWithMoveToken[0];
                let bestMove = this.getBestMove(aiPlayer.house, sourceArea, [sourceArea.orderToken.getType()]);

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

        if (gameStore.getState().gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = this.getAreasForHouseWithToken(gameStore.getState().areas, aiPlayer.house, TokenPlacementRules.RAID_ORDER_TOKENS);
            // TODO add logic to Execute RAID Order
            if (areasWithRaidToken.length > 0) {
                TokenPlacementRules.skipOrder(areasWithRaidToken[0].key);
            }
        }


    }

    public recruit(aiPlayer: AiPlayer) {
        const areas = RecruitingRules.getAreasAllowedToRecruit(aiPlayer.house);
        areas.filter((a) => {
            return aiPlayer.house === a.controllingHouse;
        }).forEach((area) => {
            // TODO: Add Logic to recruit new units
            RecruitingRules.recruit(area);
        });
    }

    public placeAllOrderTokens(aiPlayer: AiPlayer) {
        let availableOrderToken = TokenPlacementRules.getPlacableOrderTokenTypes(aiPlayer.house);
        let areasToPlaceAToken = gameStore.getState().areas.filter((area) => {
            return TokenPlacementRules.isAllowedToPlaceOrderToken(aiPlayer.house, area.key);
        });
        // TODO: consider already placed token when calculating further best moves
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return this.getBestMove(aiPlayer.house, area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            TokenPlacementRules.addOrderToken(new OrderToken(aiPlayer.house, bestMove.orderTokenType), bestMove.sourceArea.key);
        }
    }

    public controlledByOtherPlayerWithEnemyUnits(area: Area, house: House) {
        return area.controllingHouse !== null && area.controllingHouse !== house && area.units.length > 0;
    }

    public getBestMove(currentHouse: House, area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(currentHouse, area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }

    private getAreasForHouseWithToken(areas: Area[], house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    private getAllPossibleMoves(currentHouse: House, area: Area, availableOrderToken: Array<OrderTokenType>): PossibleMove[] {
        let possibleMoves = [];
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForConsolidatePowerOrder()));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForDefendingOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForSupportOrder()));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    // TODO: Filter areas where it is allowed to raid (land units can not raid sea areas)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForRaidOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    MovementRules.getAllAreasAllowedToMarchTo(area).forEach((possibleArea) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area, this.calculateValueForMarchOrders(area, possibleArea, currentHouse), possibleArea));

                    });
                    break;
            }

        });
        return possibleMoves;
    }

    private calculateValueForDefendingOrders(area: Area, currentHouse: House, factor: number): number {
        let value = 0;
        area.borders
            .forEach((borderArea) => {
                let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== currentHouse && borderArea.units.length > 0;
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private calculateValueForRaidOrders(area: Area, currentHouse: House, factor: number) {

        let value = 0;
        area.borders
            .forEach((borderArea) => {
                let controlledByOtherPlayerWithEnemyUnits = this.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private calculateValueForConsolidatePowerOrder(): number {
        return 0.1;
    }

    private calculateValueForSupportOrder(): number {
        return 0;
    }

    private calculateValueForMarchOrders(sourceArea: Area, targetArea: Area, currentHouse: House) {
        let value = 0;
        let numberOfEnemiesAtBorder = sourceArea.borders
            .filter((borderArea) => {
                return this.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
            }).length;

        let unOccupiedOrNoEnemies = this.unOccupiedOrNoEnemies(targetArea, currentHouse);
        if (targetArea.hasCastleOrStronghold() && unOccupiedOrNoEnemies) {
            value += 0.9;
        }
        if (targetArea.supply > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetArea.supply);
        }
        if (targetArea.consolidatePower > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetArea.consolidatePower);
        }
        value -= (numberOfEnemiesAtBorder * 0.1);

        return value;
    }

    private unOccupiedOrNoEnemies(area: Area, house: House) {
        return (area.controllingHouse === null || area.controllingHouse !== null && area.controllingHouse !== house) && area.units.length === 0;
    }

    private shouldEstablishControl(sourceArea: Area): boolean {
        return (sourceArea.units.length === 0 && (sourceArea.hasCastleOrStronghold() || sourceArea.supply > 0 || sourceArea.consolidatePower > 0 ));
    }

}