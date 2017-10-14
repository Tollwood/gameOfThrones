import GameState from '../board/logic/gameStati';
import GameRules from '../board/logic/gameRules';
import {OrderToken, OrderTokenType} from '../orderToken/logic/orderToken';
import {Area} from '../board/logic/area';
import {House} from '../board/logic/house';
import {GamePhase} from '../board/logic/gamePhase';
import PossibleMove from './possibleMove';
export default class AI {

    private house: House;

    constructor(house: House) {
        this.house = house;
    }

    public placeAllOrderTokens() {
        let availableOrderToken = GameRules.getAvailableOrderToken(this.house);
        let areasToPlaceAToken = GameState.getInstance().areas.filter((area) => {
            return GameRules.isAllowedToPlaceOrderToken(this.house, area.key);
        });
        // TODO: consider already placed token when calculating further best moves
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return this.getBestMove(area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            GameRules.addOrderToken(new OrderToken(this.house, bestMove.orderTokenType), bestMove.sourceArea.key);
        }
    }

    public executeOrder(gamePhase: GamePhase) {

        if (gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = this.getAreasWithToken(this.house, GameRules.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                // TODO: Pick most important moveToken first
                let sourceArea = areasWithMoveToken[0];
                let bestMove = this.getBestMove(sourceArea, [sourceArea.orderToken.getType()]);

                if (bestMove === null) {
                    GameRules.skipOrder(sourceArea.key);
                    return;
                }
                if (bestMove.targetArea !== null) {
                    GameRules.moveUnits(sourceArea.key, bestMove.targetArea.key, sourceArea.units);
                    return;
                }
            }
        }

        if (gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = this.getAreasWithToken(this.house, GameRules.RAID_ORDER_TOKENS);
            // TODO add logic to Execute RAID Order
            if (areasWithRaidToken.length > 0) {
                GameRules.skipOrder(areasWithRaidToken[0].key);
            }
        }


    }

    private getAreasWithToken(house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return GameState.getInstance().areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    public recruit(areas: Area[]) {
        areas.filter((a) => {
            return this.house === a.controllingHouse;
        }).forEach((area) => {
            // TODO: Add Logic to recruit new units
            GameRules.recruit(area);
        });
    }

    private getAllPossibleMoves(area: Area, availableOrderToken: Array<OrderTokenType>) {
        let possibleMoves = new Array<PossibleMove>();
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    // TODO Add logic when to consolidate power
                    possibleMoves.push(new PossibleMove(orderTokenType, area, 0.1));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.getValueForDefendingOrders(area)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    // TODO add logic when to support units (this feature is not yet implemented in the game)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, 0));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    // TODO: Filter areas where it is allowed to raid (land units can not raid sea areas)
                    possibleMoves.push(new PossibleMove(orderTokenType, area, this.getValueForRaidOrders(area)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    area.borders.filter((borderArea) => {
                        return GameRules.isAllowedToMove(area, borderArea, area.units[0]);
                    }).forEach((borderArea) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area, this.getValueForMarchOrders(area, borderArea), borderArea));

                    });
                    break;
            }

        });
        return possibleMoves;
    }

    private getValueForDefendingOrders(area: Area): number {
        let value = 0;
        area.borders.forEach((borderArea) => {
            let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== this.house && borderArea.units.length > 0;
            if (controlledByOtherPlayerWithEnemyUnits) {
                // TODO create value Map and add different AI difficulties appyling different values
                value += 0.1;
            }
        });
        return value;
    }

    private getValueForRaidOrders(area: Area) {

        let value = 0;
        area.borders.forEach((borderArea) => {
            let controlledByOtherPlayerWithEnemyUnits = borderArea.controllingHouse !== null && borderArea.controllingHouse !== this.house && borderArea.units.length > 0;
            if (controlledByOtherPlayerWithEnemyUnits) {
                // TODO create value Map and add different AI difficulties appyling different values
                value += 0.1;
            }
        });
        return value;
    }

    private getValueForMarchOrders(sourceArea: Area, targetArea: Area) {
        let value = 0;
        let numberOfEnemiesAtBorder = sourceArea.borders.filter((borderArea) => {
            return this.controlledByOtherPlayerWithEnemyUnits(borderArea);
        }).length;

        let noEnemies = this.noEnemies(targetArea);
        if (targetArea.hasCastleOrStronghold() && noEnemies) {
            // TODO create value Map and add different AI difficulties appyling different values
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

    private controlledByOtherPlayerWithEnemyUnits(area: Area) {
        return area.controllingHouse !== null && area.controllingHouse !== this.house && area.units.length > 0;
    }

    private noEnemies(area: Area) {
        return (area.controllingHouse === null || area.controllingHouse !== null && area.controllingHouse !== this.house) && area.units.length === 0;
    }

    private getBestMove(area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }

}