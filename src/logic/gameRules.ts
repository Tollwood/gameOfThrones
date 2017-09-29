import {Area, AreaKey} from './area';
import GameState from './gameStati';
import {House} from './house';
import {OrderToken, OrderTokenType} from './orderToken';
import {GamePhase} from './gamePhase';
import {Unit} from './units';

export default class GameRules {

    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = GameRules.getAreaByKey(areaKey);
        return area !== null && area.units.length > 0
            && area.units[0].getHouse() === house
            && area.orderToken === null;
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: AreaKey) {
        const area = GameRules.getAreaByKey(areaKey);
        area.orderToken = ordertoken;
    }


    public static allOrderTokenPlaced(currentPlayer: House): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.units.length > 0 && area.units[0].getHouse() === currentPlayer && area.orderToken === null;
            }).length === 0;
    }

    public static nextRound() {
        this.switchToPhase(GamePhase.PLANNING);
        const gameState = GameState.getInstance();
        gameState.nextRound();
        gameState.currentPlayer = gameState.players.filter((player) => {
            return !player.computerOpponent;
        })[0];
    }

    public static switchToPhase(phase: GamePhase) {
        GameState.getInstance().gamePhase = phase;
    }

    private resetOrderToken() {
        GameState.getInstance().areas.map((area) => {
            area.orderToken = null;
        });
    }

    public static executeRaidOrder(source: AreaKey, target: AreaKey) {
        let sourceArea = this.getAreaByKey(source);
        sourceArea.orderToken = null;

        const targetArea = this.getAreaByKey(target);
        if (targetArea.orderToken.isConsolidatePowerToken()) {
            GameState.getInstance().players.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0].powerToken++;
        }
        targetArea.orderToken = null;

        this.nextPlayer();
    }

    public static executeConsolidatePowerOrder(source: AreaKey) {
        let sourceArea = this.getAreaByKey(source);
        sourceArea.orderToken = null;
        const area = this.getAreaByKey(source);
        let additionalPowerToken = area.consolidatePower + 1;
        GameState.getInstance().players.filter((player) => {
            return player.house === sourceArea.controllingHouse;
        })[0].powerToken += additionalPowerToken;
        this.nextPlayer();
    }

    public static moveUnits(source: AreaKey, target: AreaKey, unit: Unit): boolean {
        let sourceArea = this.getAreaByKey(source);
        let targetArea = this.getAreaByKey(target);
        let validMove: boolean = this.isAllowedToMove(sourceArea, targetArea, unit);
        if (validMove) {
            sourceArea.orderToken = null;
            targetArea.units = targetArea.units.concat(sourceArea.units);
            sourceArea.units = new Array<Unit>();
            sourceArea.controllingHouse = null;
            targetArea.controllingHouse = unit.getHouse();
            this.nextPlayer();
        }
        return validMove;
    }

    public static skipOrder(source: AreaKey) {
        let sourceArea = GameRules.getAreaByKey(source);
        sourceArea.orderToken = null;
        this.nextPlayer();
    }

    public static isAllowedToMove(source: Area, target: Area, unit: Unit): boolean {
        let hasUnitsToMove = source.units.length > 0;
        let moveOnLand = target.isLandArea && unit.isLandunit();
        let moveOnSea = !target.isLandArea && !unit.isLandunit();
        let isConnectedArea = source.borders.filter((area) => {
                return area.key === target.key;
            }).length === 1;
        let hasUnitOfSameTypeToMove = source.units.filter((unitToCheck) => {
                return unitToCheck.getHouse() === unit.getHouse() && unitToCheck.getType() === unit.getType();
            }).length > 0;
        let requiresCombat = target.units.filter((unitToCheck) => {
                return unit.getHouse() !== unitToCheck.getHouse();
            }).length !== 0;
        let connectedUsingShipTransport = GameRules.connectedUsingShipTransport(source, target);
        return source.key !== target.key
            && hasUnitsToMove
            && hasUnitOfSameTypeToMove
            && (this.isConnectedArea(source, target) || connectedUsingShipTransport)
            && (moveOnLand || moveOnSea)
            && !requiresCombat;

    }

    public static connectedUsingShipTransport(source: Area, target: Area): boolean {
        return source.borders
                .filter((seaArea) => {
                    return !seaArea.isLandArea && seaArea.units.length > 0 && seaArea.units[0].getHouse() === source.units[0].getHouse();
                })
                .filter((areaWithShip) => {
                    return areaWithShip.borders.filter((areaReachableByShip) => {
                            return areaReachableByShip.key === target.key;
                        }).length > 0;
                }).length > 0;
    }

    public static getAreaByKey(areaKey: AreaKey): Area {
        return GameState.getInstance().areas.filter((area) => {
            return area.key === areaKey;
        })[0];
    }

    public static isPlanningPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.PLANNING && this.allOrderTokenPlaced(GameState.getInstance().currentPlayer.house);
    }

    public static isActionPhaseComplete(): boolean {
        return GameState.getInstance().gamePhase === GamePhase.ACTION && this.allOrderTokenRevealed();
    }

    private static allOrderTokenRevealed(): boolean {
        return GameState.getInstance().areas.filter((area) => {
                return area.orderToken;
            }).length === 0;
    }

    public static getAvailableOrderToken(house: House): Array<OrderTokenType> {
        let alreadyPlacedOrderTokens: Array<OrderTokenType> = GameState.getInstance().areas.filter((area) => {
            return area.orderToken && area.units.length > 0 && area.units[0].getHouse() === house;
        }).map((area) => {
            return area.orderToken.getType();
        });

        return [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special, OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special, OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special].filter((type) => {

            return alreadyPlacedOrderTokens.indexOf(type) === -1;
        });
    }

    public static nextPlayer() {
        let gamestate = GameState.getInstance();
        let currrentIndex = gamestate.ironThroneSuccession.indexOf(gamestate.currentPlayer.house);
        let nextIndex = gamestate.ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        let nextHouse = gamestate.ironThroneSuccession[nextIndex];
        gamestate.currentPlayer = gamestate.players.filter((player) => {
            return player.house === nextHouse;
        })[0];
    }

    public static startActionPhase() {
        this.switchToPhase(GamePhase.ACTION);
        let gamestate = GameState.getInstance();
        gamestate.currentPlayer = gamestate.players.filter((player) => {
            return player.house === gamestate.ironThroneSuccession[0];
        })[0];
    }

    public static isAllowedToRaid(sourceArea: Area, targetArea: Area) {
        return this.isConnectedArea(sourceArea, targetArea)
            && targetArea.controllingHouse
            && sourceArea.controllingHouse !== targetArea.controllingHouse
            && (sourceArea.isLandArea && targetArea.isLandArea || !sourceArea.isLandArea);
    }

    private static isConnectedArea(source: Area, target: Area) {
        return source.borders.filter((area) => {
                return area.key === target.key;
            }).length === 1;
    }

    static establishControl(area: Area) {
        let currentPlayer = GameState.getInstance().currentPlayer;
        currentPlayer.powerToken--;

        GameState.getInstance().areas.filter((gameStateArea) => {
            return area.key === gameStateArea.key;
        }).map((area) => {
            area.controllingHouse = currentPlayer.house;
        });
    }
}