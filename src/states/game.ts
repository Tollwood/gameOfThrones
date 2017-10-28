import OrderTokenRenderer from '../ui/orderToken/orderTokenRenderer';
import BoardRenderer from '../board/ui/boardRenderer';
import TopMenuRenderer from '../board/ui/topMenu/topMenuRenderer';
import UnitRenderer from '../ui/units/unitRenderer';
import GameRules from '../board/logic/gameRules/gameRules';
import {GamePhase} from '../board/logic/gamePhase';
import PowerToken from '../ui/orderToken/powerTokenRenderer';
import Renderer from '../utils/renderer';
import WinningModal from '../board/ui/winningModal';
import {OrderTokenMenuRenderer} from '../ui/orderToken/orderTokenMenuRenderer';
import AssetLoader from '../utils/assetLoader';
import WesterosCardModal from '../ui/cards/westerosCardModal';
import {WesterosCard, WesterosCardState} from '../logic/cards/westerosCard';
import GamePhaseService from '../board/logic/gamePhaseService';
import RecruitingRenderer from '../ui/units/recruitingRenderer';
import AiPlayer from '../logic/ai/aiPlayer';
import WesterosCardRules from '../board/logic/gameRules/westerosCardRules';
import RecruitingRules from '../board/logic/gameRules/recruitingRules';
import VictoryRules from '../board/logic/gameRules/victoryRules';
import TokenPlacementRules from '../board/logic/gameRules/tokenPlacementRules';

export default class Game extends Phaser.State {
    private orderTokenRenderer: OrderTokenRenderer;
    private boardRenderer: BoardRenderer;
    private topMenuRenderer: TopMenuRenderer;
    private currentGameWidth: number;
    private unitRenderer: UnitRenderer;

    constructor() {
        super();
        this.orderTokenRenderer = new OrderTokenRenderer();
        this.boardRenderer = new BoardRenderer();
        this.topMenuRenderer = new TopMenuRenderer();
        this.unitRenderer = new UnitRenderer();
    }

    public preload() {
        AssetLoader.loadAssets(this.game);
        this.topMenuRenderer.loadAssets(this.game);
    }

    public create(): void {
        AssetLoader.createAssets(this.game);
        GameRules.newGame();
        BoardRenderer.renderBoard(this.game);
        this.unitRenderer.createGroups(this.game);
        this.orderTokenRenderer.createGroups(this.game);
        RecruitingRenderer.createGroups(this.game);
        PowerToken.createGroups(this.game);
        this.game.input.enabled = true;
        this.currentGameWidth = window.innerWidth;
        Renderer.rerenderRequired = true;
    }

    public update() {
        if (this.currentGameWidth !== window.innerWidth) {
            OrderTokenMenuRenderer.renderOrderTokenInMenu(this.game, AssetLoader.getAreaTokens());
            this.currentGameWidth = window.innerWidth;
        }

        if (Renderer.rerenderRequired) {
            this.topMenuRenderer.renderTopMenu(this.game);
            this.topMenuRenderer.renderGameState(this.game);
            PowerToken.renderPowerToken(this.game);
            PowerToken.renderControlToken(this.game);
            this.unitRenderer.renderUnits(this.game);
            let currentGamePhase = GameRules.gameState.gamePhase;
            let currentPlayer = GameRules.gameState.currentPlayer;
            let currentAiPlayer: AiPlayer = currentPlayer instanceof AiPlayer ? currentPlayer as AiPlayer : null;
            if (currentAiPlayer !== null) {
                this.orderTokenRenderer.removePlacedToken();
            }

            if (GamePhaseService.isWesterosPhase(currentGamePhase)) {
                let rerender = this.renderWesterosPhase(currentGamePhase, currentAiPlayer);
                if (rerender) {
                    return;
                }
            }

            if (currentGamePhase === GamePhase.PLANNING) {
                if (GamePhaseService.isPlanningPhaseComplete()) {
                    GamePhaseService.switchToNextPhase();
                    OrderTokenMenuRenderer.removeOrderTokenMenu();
                    this.orderTokenRenderer.removePlaceHolder();
                    return;
                }

                if (currentAiPlayer === null) {
                    this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                    OrderTokenMenuRenderer.renderOrderTokenInMenu(this.game, AssetLoader.getAreaTokens());
                    let remainingPlacableToken = this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameRules.gameState.currentPlayer.house);
                    if (remainingPlacableToken === 0) {
                        GamePhaseService.nextPlayer();
                        return;
                    }
                } else {
                    currentAiPlayer.placeAllOrderTokens();
                    GamePhaseService.nextPlayer();
                    return;
                }
            }

            if (GamePhaseService.isActionPhase(currentGamePhase)) {
                if (!GamePhaseService.isStillIn(currentGamePhase)) {
                    GamePhaseService.switchToNextPhase();
                    return;
                }

                if (currentGamePhase === GamePhase.ACTION_RAID || currentGamePhase === GamePhase.ACTION_MARCH) {
                    if (currentAiPlayer === null) {
                        this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);
                        this.checkForWinner();
                        if ((currentGamePhase === GamePhase.ACTION_RAID && GamePhaseService.allRaidOrdersRevealed(currentPlayer.house)) ||
                            (currentGamePhase === GamePhase.ACTION_MARCH && GamePhaseService.allMarchOrdersRevealed(currentPlayer.house))) {
                            GamePhaseService.nextPlayer();
                            return;
                        }
                    } else {
                        currentAiPlayer.executeOrder(currentGamePhase);
                        GamePhaseService.nextPlayer();
                        this.checkForWinner();
                        return;
                    }
                }

                if (currentGamePhase === GamePhase.ACTION_CONSOLIDATE_POWER) {
                    TokenPlacementRules.executeAllConsolidatePowerOrders();
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (currentGamePhase === GamePhase.ACTION_CLEANUP) {
                    GamePhaseService.nextRound();
                    Renderer.rerenderRequired = true;
                    return;
                }
            }

            Renderer.rerenderRequired = false;
        }

        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
    }

    private checkForWinner() {
        let winningHouse = VictoryRules.getWinningHouse();
        if (winningHouse !== null) {
            let winningModal = new WinningModal(this.game, winningHouse);
            winningModal.show();
        }
    }

    private renderWesterosPhase(currentGamePhase: GamePhase, currentAiPlayer: AiPlayer): boolean {

        let card: WesterosCard;

        switch (currentGamePhase) {
            case GamePhase.WESTEROS1:
                card = WesterosCardRules.getWesterosCard(1);
                break;
            case GamePhase.WESTEROS2:
                card = WesterosCardRules.getWesterosCard(2);
                break;
            case GamePhase.WESTEROS3:
                card = WesterosCardRules.getWesterosCard(3);
                break;
        }

        if (card.state === WesterosCardState.showCard) {
            let modal = new WesterosCardModal(this.game, card);
            modal.show();
            card.state = WesterosCardState.displayCard;
        }
        if (card.state === WesterosCardState.played) {
            return true;
        }

        if (currentAiPlayer !== null && card.state === WesterosCardState.executeCard) {
            currentAiPlayer.recruit(RecruitingRules.getAreasAllowedToRecruit());
            GamePhaseService.nextPlayer();
            return true;
        } else if (currentAiPlayer === null && card.state === WesterosCardState.executeCard) {
            let remainingAreas = RecruitingRenderer.highlightPossibleArea(this.game);
            if (remainingAreas === 0) {
                GamePhaseService.nextPlayer();
                return true;
            }
            return false;
        }
    }
}