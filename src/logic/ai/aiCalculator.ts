import {Area} from '../board/area';
import {House} from '../board/house';
import PossibleMove from './possibleMove';
import StateSelectorService from '../board/gameRules/stateSelectorService';
import {OrderTokenType} from '../orderToken/orderTokenType';
import {GamePhase} from '../board/gamePhase';
import TokenPlacementRules from '../board/gameRules/tokenPlacementRules';
import AiPlayer from './aiPlayer';
import {OrderToken} from '../orderToken/orderToken';
import {gameStore} from '../board/gameState/reducer';
import {moveUnits, placeOrder, resolveFight, skipOrder} from '../board/gameState/actions';
import CombatResult from '../march/combatResult';
import CombatCalculator from '../march/combatCalculator';
import {GameStoreState} from '../board/gameState/gameStoreState';

export default class AiCalculator {

    public static executeOrder(state: GameStoreState, aiPlayer: AiPlayer) {

        if (state.gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = this.getAreasForHouseWithToken(gameStore.getState().areas.values(), aiPlayer.house, TokenPlacementRules.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                let sourceArea = areasWithMoveToken[0];
                let bestMove = AiCalculator.getBestMove(aiPlayer.house, sourceArea, [sourceArea.orderToken.getType()]);
                const targetArea = state.areas.get(bestMove.targetAreaKey);
                if (bestMove === null) {
                    gameStore.dispatch(skipOrder(sourceArea.key));
                    return;
                }
                if (targetArea.units.length > 0 && targetArea.controllingHouse !== sourceArea.controllingHouse) {
                    const comabtResult: CombatResult = CombatCalculator.calculateCombat(sourceArea, targetArea);
                    gameStore.dispatch(resolveFight(comabtResult));
                    return;
                }
                gameStore.dispatch(moveUnits(sourceArea.key, bestMove.targetAreaKey, sourceArea.units, true, AiCalculator.shouldEstablishControl(sourceArea)));
                return;
            }
        }

        if (state.gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = this.getAreasForHouseWithToken(state.areas.values(), aiPlayer.house, TokenPlacementRules.RAID_ORDER_TOKENS);
            if (areasWithRaidToken.length > 0) {
                gameStore.dispatch(skipOrder(areasWithRaidToken[0].key));
            }
        }

    }

    public static recruit(state: GameStoreState, aiPlayer: AiPlayer): Area {
        const areas = StateSelectorService.getAreasAllowedToRecruit(state, aiPlayer.house);
        const possibleAreasToRecruit = areas.filter((a) => {
            return aiPlayer.house === a.controllingHouse;
        });
        if (possibleAreasToRecruit.length > 0) {
            return possibleAreasToRecruit[0];
        }
        return null;
    }

    public static placeAllOrderTokens(state: GameStoreState, house: House) {
        let availableOrderToken = TokenPlacementRules.getPlacableOrderTokenTypes(state, house);
        let areasToPlaceAToken = state.areas.values().filter((area) => {
            return TokenPlacementRules.isAllowedToPlaceOrderToken(house, area.key);
        });
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return this.getBestMove(house, area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            gameStore.dispatch(placeOrder(bestMove.sourceAreaKey, new OrderToken(house, bestMove.orderTokenType)));
        }
    }

    public static controlledByOtherPlayerWithEnemyUnits(area: Area, house: House) {
        return area.controllingHouse !== null && area.controllingHouse !== house && area.units.length > 0;
    }

    public static getBestMove(currentHouse: House, area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(currentHouse, area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }

    public static getAreasForHouseWithToken(areas: Area[], house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    public static getAllPossibleMoves(currentHouse: House, area: Area, availableOrderToken: Array<OrderTokenType>): PossibleMove[] {
        let possibleMoves = [];
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForConsolidatePowerOrder()));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForDefendingOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForSupportOrder()));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForRaidOrders(area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    StateSelectorService.getAllAreasAllowedToMarchTo(gameStore.getState(), area).forEach((possibleArea) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForMarchOrders(area, possibleArea, currentHouse), possibleArea.key));
                    });
                    break;
            }

        });
        return possibleMoves;
    }

    private static calculateValueForDefendingOrders(area: Area, currentHouse: House, factor: number): number {
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

    private static calculateValueForRaidOrders(area: Area, currentHouse: House, factor: number) {

        let value = 0;
        area.borders
            .forEach((borderArea) => {
                let controlledByOtherPlayerWithEnemyUnits = AiCalculator.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private static calculateValueForConsolidatePowerOrder(): number {
        return 0.1;
    }

    private static calculateValueForSupportOrder(): number {
        return 0;
    }

    private static calculateValueForMarchOrders(sourceArea: Area, targetArea: Area, currentHouse: House) {
        let value = 0;
        let numberOfEnemiesAtBorder = sourceArea.borders
            .filter((borderArea) => {
                return AiCalculator.controlledByOtherPlayerWithEnemyUnits(borderArea, currentHouse);
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

    public static unOccupiedOrNoEnemies(area: Area, house: House) {
        return (area.controllingHouse === null || area.controllingHouse !== null && area.controllingHouse !== house) && area.units.length === 0;
    }

    private static shouldEstablishControl(sourceArea: Area): boolean {
        return (sourceArea.units.length === 0 && (sourceArea.hasCastleOrStronghold() || sourceArea.supply > 0 || sourceArea.consolidatePower > 0 ));
    }

}