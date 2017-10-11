import {Area, AreaKey} from './area';
import GameState from './gameStati';
import {House} from './house';
import {OrderToken, OrderTokenType} from '../../orderToken/logic/orderToken';
import Unit from '../../units/logic/units';
import Player from './player';
import CombatResult from '../../march/combatResult';
import CombatCalculator from '../../march/combatCalculator';
import {CardExecutionPoint} from '../../cards/logic/cardExecutionPoint';
import GamePhaseService from './gamePhaseService';
import {UnitType} from '../../units/logic/unitType';
import {WesterosCard, WesterosCardState} from '../../cards/logic/westerosCard';
import CardFactory from '../../cards/logic/cardFactory';

export default class GameRules {

    // New Game
    public static newGame() {
        GameState.initGame([new Player(House.stark, 5, false, CardFactory.getHouseCards(House.stark)), new Player(House.lannister, 5, true, CardFactory.getHouseCards(House.lannister)), new Player(House.baratheon, 5, true, CardFactory.getHouseCards(House.baratheon)), new Player(House.greyjoy, 5, true, CardFactory.getHouseCards(House.greyjoy)), new Player(House.tyrell, 5, true, CardFactory.getHouseCards(House.tyrell)), new Player(House.martell, 5, true, CardFactory.getHouseCards(House.martell))]);
    }

    // place Orders
    public static isAllowedToPlaceOrderToken(house: House, areaKey: AreaKey): boolean {
        const area = GameRules.getAreaByKey(areaKey);
        return area !== null && area.units.length > 0
            && area.units[0].getHouse() === house
            && area.orderToken === null;
    }

    public static getAvailableOrderToken(house: House): Array<OrderTokenType> {
        let alreadyPlacedOrderTokens: Array<OrderTokenType> = GameState.getInstance().areas.filter((area) => {
            return area.orderToken && area.units.length > 0 && area.units[0].getHouse() === house;
        }).map((area) => {
            return area.orderToken.getType();
        });

        return GameState.getInstance().currentlyAllowedTokenTypes.filter((type) => {
            return alreadyPlacedOrderTokens.indexOf(type) === -1;
        });
    }

    public static addOrderToken(ordertoken: OrderToken, areaKey: AreaKey) {
        const area = GameRules.getAreaByKey(areaKey);
        area.orderToken = ordertoken;
    }


    // execute orders
    public static executeRaidOrder(source: AreaKey, target: AreaKey) {
        let sourceArea = this.getAreaByKey(source);
        sourceArea.orderToken = null;

        const targetArea = this.getAreaByKey(target);
        if (targetArea.orderToken.isConsolidatePowerToken()) {
            GameState.getInstance().players.filter((player) => {
                player.house === targetArea.controllingHouse;
            }).map((player) => {
                if (player.powerToken > 0) {
                    player.powerToken--;
                }
            });
            GameState.getInstance().players.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0].powerToken++;
        }
        targetArea.orderToken = null;
        GamePhaseService.nextPlayer();
    }

    public static executeAllConsolidatePowerOrders() {
        return GameState.getInstance().areas.filter((area) => {
            return area.orderToken && area.orderToken.isConsolidatePowerToken();
        }).map((sourceArea) => {
            sourceArea.orderToken = null;
            let additionalPowerToken = sourceArea.consolidatePower + 1;
            let player = GameState.getInstance().players.filter((player) => {
                return player.house === sourceArea.controllingHouse;
            })[0];
            player.powerToken += additionalPowerToken;
        });
    }

    public static establishControl(area: Area) {
        let currentPlayer = GameState.getInstance().currentPlayer;
        currentPlayer.powerToken--;

        GameState.getInstance().areas.filter((gameStateArea) => {
            return area.key === gameStateArea.key;
        }).map((area) => {
            area.controllingHouse = currentPlayer.house;
        });
    }

    public static moveUnits(source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder: boolean = true) {
        let sourceArea = this.getAreaByKey(source);
        let targetArea = this.getAreaByKey(target);

        targetArea.units = targetArea.units.concat(movingUnits);
        targetArea.controllingHouse = sourceArea.controllingHouse;

        let remainingUnits = sourceArea.units.filter(function (sourceUnit) {
            return movingUnits.indexOf(sourceUnit) === -1;
        });
        sourceArea.units = remainingUnits;
        if (sourceArea.units.length === 0) {
            sourceArea.controllingHouse = null;
        }
        if (completeOrder) {
            sourceArea.orderToken = null;
        }
    }

    public static resolveFight(combatResult: CombatResult) {
        combatResult.attackersCard.played = true;
        combatResult.defendersCard.played = true;
        CombatCalculator.resolveHouseCard(combatResult, CardExecutionPoint.afterFight);
        let loosingArea = combatResult.looser === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        let winningArea = combatResult.winner === combatResult.attackingArea.controllingHouse ? combatResult.attackingArea : combatResult.defendingArea;
        if (combatResult.attackingArea.controllingHouse === winningArea.controllingHouse) {
            loosingArea.controllingHouse = winningArea.controllingHouse;
            loosingArea.orderToken == null;
            loosingArea.units = new Array<Unit>();
            this.moveUnits(winningArea.key, loosingArea.key, winningArea.units, true);
        }
        else {
            loosingArea.units = new Array<Unit>();
            loosingArea.orderToken = null;
            loosingArea.controllingHouse = null;
        }
    }

    public static skipOrder(source: AreaKey) {
        let sourceArea = GameRules.getAreaByKey(source);
        sourceArea.orderToken = null;
        GamePhaseService.nextPlayer();
    }


    // validations
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
            && (moveOnLand || moveOnSea);
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


    // manipulate game State
    public static restrictOrderToken(notAllowedOrderTokenTypes: Array<OrderTokenType>) {
        let allowedForThisRound = GameState.getInstance().currentlyAllowedTokenTypes.filter(function (orderToken) {
            return notAllowedOrderTokenTypes.indexOf(orderToken) === -1;
        });
        GameState.getInstance().currentlyAllowedTokenTypes = allowedForThisRound;
    }

    public static consolidateAllPower() {
        let gameState = GameState.getInstance();
        gameState.players.forEach((player) => {
            let additionalPower = 0;
            gameState.areas.forEach((area) => {
                if (area.controllingHouse === player.house) {
                    additionalPower += area.consolidatePower;
                }
            });
            player.powerToken += additionalPower;
        });
        // Add logic for ships in harbour
    }

    public static increaseWildlings(wildling: number) {
        if (GameState.getInstance().wildlingsCount + wildling >= 12) {
            GameState.getInstance().wildlingsCount = 12;
        } else {
            GameState.getInstance().wildlingsCount += wildling;

        }

    }

    public static getVictoryPositionFor(house: House) {
        return GameState.getInstance().areas.filter((area: Area) => {
            return area.controllingHouse === house && area.hasCastleOrStronghold();
        }).length;
    }

    public static getNumberOfSupply(house: House): number {
        return GameState.getInstance().areas.filter((area: Area) => {
            return area.controllingHouse === house && area.supply > 0;
        }).map((area) => {
            return area.supply
        }).reduce(
            (accumulator,
             currentValue) => {
                return accumulator + currentValue;
            }, 0
        );
    }

    public static getWinningHouse(): House {
        let winningHouse: House = null;
        let gamestate = GameState.getInstance();
        gamestate.players.forEach((player) => {
            if (this.getVictoryPositionFor(player.house) === 7) {
                winningHouse = player.house;
            }
        });
        if (gamestate.round === 10) {
            let sortedPlayersByVictoryPoints = gamestate.players.sort((a, b) => {
                return this.getVictoryPositionFor(b.house) - this.getVictoryPositionFor(a.house);
            });
            winningHouse = sortedPlayersByVictoryPoints[0].house;
        }
        return winningHouse;
    }


    // helper
    public static getAreaByKey(areaKey: AreaKey): Area {
        return GameState.getInstance().areas.filter((area) => {
            return area.key === areaKey;
        })[0];
    }

    public static getAllAreasForMustering(house?: House) {
        return GameState.getInstance().areasToMuster.filter((area) => {
            return house === undefined || area.controllingHouse === house;
        });
    }

    public static setAreasForMustering() {
        let areasForMustering = GameState.getInstance().areas.filter((area) => {
            return area.controllingHouse !== null && area.hasCastleOrStronghold();
        });
        GameState.getInstance().areasToMuster = areasForMustering;
    }

    public static mustering(area: Area, unitTypes: UnitType[] = []) {
        let areasToMuster = GameState.getInstance().areasToMuster;
        let index = areasToMuster.indexOf(area);
        areasToMuster.splice(index, 1);
        unitTypes.forEach((unittype) => {
            area.units.push(new Unit(unittype, area.controllingHouse));
        });
    }

    public static getWesterosCard(cardType: number) {
        let card = GameState.getInstance().currentWesterosCard;

        if (card == null) {
            card = this.playNewCard(cardType);
        }
        else if (card !== null && card.state === WesterosCardState.executeCard) {
            if (this.stillPlayingWesterosCard()) {
                return card;
            }
            else {
                GamePhaseService.switchToNextPhase();
                GameState.getInstance().currentWesterosCard = null;
                return card;
            }
        }
        GameState.getInstance().currentWesterosCard = card;
        return card;
    }

    private static playNewCard(cardType: number): WesterosCard {

        let cards: WesterosCard[];
        switch (cardType) {
            case 1:
                cards = GameState.getInstance().westerosCards1;
                break;
            case 2:
                cards = GameState.getInstance().westerosCards2;
                break;
            case 3:
                cards = GameState.getInstance().westerosCards3;
                break;
        }

        let card = CardFactory.playNextCard(cards);
        GameState.getInstance().currentWesterosCard = card;
        return card;
    }

    private static stillPlayingWesterosCard() {
        let gameState = GameState.getInstance();
        switch (gameState.currentWesterosCard.selectedFunction.functionName) {
            case "recruit":
                return GameState.getInstance().areasToMuster.length > 0;
            default:
                return false;
        }
    }
}