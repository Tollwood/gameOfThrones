import {Area, AreaKey} from './area';
import GameState from './gameStati';
import {House} from './house';
import {OrderToken} from './orderToken';
import {isUndefined} from 'util';
import {GamePhase} from './gamePhase';
import {Unit} from './units';

export default class GameRules {

    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = GameRules.getAreaByKey(areaKey);
        return !isUndefined(area) && area.units.length > 0
            && area.units[0].getHouse() === house
            && area.orderToken === undefined;
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: AreaKey) {
        const area = GameRules.getAreaByKey(areaKey);
        area.orderToken = ordertoken;
    }


    public static allOrderTokenPlaced(currentPlayer: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.units.length > 0 && area.units[0].getHouse() === currentPlayer && isUndefined(area.orderToken);
            }).length === 0;
    }

    public static nextRound() {
        const gameState = GameState.getInstance();
        gameState.nextRound();
    }

    public static switchToPhase(phase: GamePhase) {
        GameState.getInstance().gamePhase = phase;
    }

    private resetOrderToken() {
        GameState.getInstance().areas.map((area) => {
            area.orderToken = undefined;
        });
    }

    public static moveUnits(source: AreaKey, target: AreaKey, unit: Unit): boolean {
        let sourceArea = GameRules.getAreaByKey(source);
        let targetArea = GameRules.getAreaByKey(target);
        let validMove: boolean = GameRules.isAllowedToMove(sourceArea, targetArea, unit);
        if (validMove) {
            sourceArea.orderToken = undefined;
            targetArea.units = targetArea.units.concat(sourceArea.units);
            sourceArea.units = new Array<Unit>();
        }
        return validMove
    }

    public static isAllowedToMove(source: Area, target: Area, unit: Unit): boolean {
        let hasUnitsToMove = source.units.length > 0;
        let moveOnLand = target.isLandArea && unit.isLandunit()
        let moveOnSea = !target.isLandArea && !unit.isLandunit()
        let isConnectedArea = source.borders.filter((area) => {
                return area.key === target.key
            }).length === 1;
        let hasUnitOfSameTypeToMove = source.units.filter((unitToCheck) => {
                return unitToCheck.getHouse() === unit.getHouse() && unitToCheck.getType() === unit.getType()
            }).length > 0;
        let requiresCombat = target.units.filter((unitToCheck) => {
                return unit.getHouse() !== unitToCheck.getHouse()
            }).length !== 0
        let connectedUsingShipTransport = GameRules.connectedUsingShipTransport(source, target);
        return hasUnitsToMove
            && hasUnitOfSameTypeToMove
            && (isConnectedArea || connectedUsingShipTransport)
            && (moveOnLand || moveOnSea)
            && !requiresCombat;

    }

    public static connectedUsingShipTransport(source: Area, target: Area): boolean {
        return source.borders
                .filter((seaArea) => {
                    return !seaArea.isLandArea && seaArea.units.length > 0 && seaArea.units[0].getHouse() === source.units[0].getHouse()
                })
                .filter((areaWithShip) => {
                    return areaWithShip.borders.filter((areaReachableByShip) => {
                            return areaReachableByShip.key === target.key;
                        }).length > 0;
                }).length > 0;
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        return GameState.getInstance().areas.filter((area) => {
            return area.key === areaKey
        })[0];
    }

    public static isPlanningPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.PLANNING && this.allOrderTokenPlaced(GameState.getInstance().currentPlayer);
    }

    public static isActionPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.ACTION && this.allOrderTokenRevealed(GameState.getInstance().currentPlayer);
    }

    private static allOrderTokenRevealed(currentPlayer: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken && area.orderToken.getHouse() === currentPlayer;
            }).length === 0;
    }

}