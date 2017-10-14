import OrderTokenRenderer from '../orderToken/ui/orderTokenRenderer';
import BoardRenderer from '../board/ui/boardRenderer';
import TopMenuRenderer from '../board/ui/topMenu/topMenuRenderer';
import GameState from '../board/logic/gameStati';
import UnitRenderer from '../units/ui/unitRenderer';
import GameRules from '../board/logic/gameRules';
import {GamePhase} from '../board/logic/gamePhase';
import Player from '../board/logic/player';
import PowerToken from '../orderToken/ui/powerTokenRenderer';
import Renderer from '../utils/renderer';
import WinningModal from '../board/ui/winningModal';
import {OrderTokenMenuRenderer} from '../orderToken/ui/orderTokenMenuRenderer';
import AssetLoader from '../utils/assetLoader';
import WesterosCardModal from '../cards/ui/westerosCardModal';
import {WesterosCard, WesterosCardState} from '../cards/logic/westerosCard';
import GamePhaseService from '../board/logic/gamePhaseService';
import RecruitingRenderer from '../units/ui/recruitingRenderer';

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
            let currentGamePhase = GameState.getInstance().gamePhase;
            let currentPlayer = GameState.getInstance().currentPlayer;


            if (GamePhaseService.isWesterosPhase(currentGamePhase)) {
                let rerender = this.renderWesterosPhase(currentGamePhase, currentPlayer);
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

                if (currentPlayer.ai === null) {
                    this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                    OrderTokenMenuRenderer.renderOrderTokenInMenu(this.game, AssetLoader.getAreaTokens());
                    let remainingPlacableToken = this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer.house);
                    if (remainingPlacableToken === 0) {
                        GamePhaseService.nextPlayer();
                        return;
                    }
                } else {
                    currentPlayer.ai.placeAllOrderTokens();
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
                    if (currentPlayer.ai === null) {
                        this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);
                        this.checkForWinner();
                        if ((currentGamePhase === GamePhase.ACTION_RAID && GamePhaseService.allRaidOrdersRevealed(currentPlayer.house)) ||
                            (currentGamePhase === GamePhase.ACTION_MARCH && GamePhaseService.allMarchOrdersRevealed(currentPlayer.house))) {
                            GamePhaseService.nextPlayer();
                            return;
                        }
                    } else {
                        currentPlayer.ai.executeOrder(currentGamePhase);
                        GamePhaseService.nextPlayer();
                        this.checkForWinner();
                        return;
                    }
                }

                if (currentGamePhase === GamePhase.ACTION_CONSOLIDATE_POWER) {
                    GameRules.executeAllConsolidatePowerOrders();
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
        let winningHouse = GameRules.getWinningHouse();
        if (winningHouse !== null) {
            WinningModal.showWinningModal(this.game, winningHouse);
        }
    }

    private renderWesterosPhase(currentGamePhase: GamePhase, currentPlayer: Player): boolean {

        let card: WesterosCard;

        switch (currentGamePhase) {
            case GamePhase.WESTEROS1:
                card = GameRules.getWesterosCard(1);
                break;
            case GamePhase.WESTEROS2:
                card = GameRules.getWesterosCard(2);
                break;
            case GamePhase.WESTEROS3:
                card = GameRules.getWesterosCard(3);
                break;
        }

        if (card.state === WesterosCardState.showCard) {
            WesterosCardModal.showModal(this.game, card);
            card.state = WesterosCardState.displayCard;
        }
        if (card.state === WesterosCardState.played) {
            return true;
        }

        if (currentPlayer.ai !== null && card.state === WesterosCardState.executeCard) {
            currentPlayer.ai.recruit(GameRules.getAreasAllowedToRecruit());
            GamePhaseService.nextPlayer();
            return true;
        } else if (currentPlayer.ai === null && card.state === WesterosCardState.executeCard) {
            let remainingAreas = RecruitingRenderer.highlightPossibleArea(this.game);
            if (remainingAreas === 0) {
                GamePhaseService.nextPlayer();
                return true;
            }
            return false;
        }
    }
}