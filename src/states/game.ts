import OrderTokenRenderer from '../ui/orderToken/orderTokenRenderer';
import BoardRenderer from '../ui/board/boardRenderer';
import TopMenuRenderer from '../ui/board/topMenu/topMenuRenderer';
import UnitRenderer from '../ui/units/unitRenderer';
import GameRules from '../logic/board/gameRules/gameRules';
import {GamePhase} from '../logic/board/gamePhase';
import Renderer from '../utils/renderer';
import WinningModal from '../ui/board/winningModal';
import {OrderTokenMenuRenderer} from '../ui/orderToken/orderTokenMenuRenderer';
import AssetLoader from '../utils/assetLoader';
import WesterosCardModal from '../ui/cards/westerosCardModal';
import {WesterosCard, WesterosCardState} from '../logic/cards/westerosCard';
import GamePhaseService from '../logic/board/gamePhaseService';
import RecruitingRenderer from '../ui/units/recruitingRenderer';
import AiPlayer from '../logic/ai/aiPlayer';
import WesterosCardRules from '../logic/board/gameRules/westerosCardRules';
import AiCalculator from '../logic/ai/aiCalculator';
import {gameStore} from '../logic/board/gameState/reducer';
import {nextPhase, nextPlayer} from '../logic/board/gameState/actions';
import PowerTokenRenderer from '../ui/orderToken/powerTokenRenderer';
import StateSelectorService from '../logic/board/gameRules/stateSelectorService';

export default class Game extends Phaser.State {
    private orderTokenRenderer: OrderTokenRenderer;
    private boardRenderer: BoardRenderer;
    private topMenuRenderer: TopMenuRenderer;
    private powerTokenRenderer: PowerTokenRenderer;
    private currentGameWidth: number;
    private unitRenderer: UnitRenderer;
    private aiCalculator: AiCalculator;
    private recruitingRenderer: RecruitingRenderer;
    private winningModal: WinningModal;
    private orderTokenMenuRenderer: OrderTokenMenuRenderer;

    constructor() {
        super();
        this.orderTokenRenderer = new OrderTokenRenderer();
        this.boardRenderer = new BoardRenderer();
        this.powerTokenRenderer = new PowerTokenRenderer();
        this.unitRenderer = new UnitRenderer();
        this.aiCalculator = new AiCalculator();
        this.recruitingRenderer = new RecruitingRenderer();
        this.orderTokenMenuRenderer = new OrderTokenMenuRenderer();
    }

    public preload() {
        AssetLoader.loadAssets(this.game);
    }

    public create(): void {
        AssetLoader.createAssets(this.game);
        GameRules.newGame();
        BoardRenderer.renderBoard(this.game);
        this.topMenuRenderer = new TopMenuRenderer(this.game);
        this.unitRenderer.createGroups(this.game);
        this.orderTokenRenderer.init(this.game);
        this.recruitingRenderer.init(this.game);
        this.powerTokenRenderer.init(this.game);
        this.orderTokenMenuRenderer.init(this.game);
        this.winningModal = new WinningModal(this.game);
        this.game.input.enabled = true;
        this.currentGameWidth = window.innerWidth;
        Renderer.rerenderRequired = true;
    }

    // TODO replace all this logic with redux actions
    public update() {
        if (this.currentGameWidth !== window.innerWidth) {
            // this.orderTokenMenuRenderer.renderOrderTokenInMenu(AssetLoader.getAreaTokens());
            this.currentGameWidth = window.innerWidth;
        }

        if (Renderer.rerenderRequired) {
            this.topMenuRenderer.renderTopMenu(this.game);
            // move away and subscribe to gameState
            this.powerTokenRenderer.renderControlToken(this.game);

            this.unitRenderer.renderUnits(this.game);
            let currentGamePhase = gameStore.getState().gamePhase;
            let currentHouse = gameStore.getState().currentHouse;
            let currentPlayer = StateSelectorService.getPlayerByHouse(currentHouse);
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
                if (currentAiPlayer !== null) {
                    this.aiCalculator.placeAllOrderTokens(currentAiPlayer);
                    gameStore.dispatch(nextPlayer());
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
                        if ((currentGamePhase === GamePhase.ACTION_RAID && GamePhaseService.allRaidOrdersRevealed(currentHouse)) ||
                            (currentGamePhase === GamePhase.ACTION_MARCH && GamePhaseService.allMarchOrdersRevealed(currentHouse))) {
                            gameStore.dispatch(nextPlayer());
                            return;
                        }
                    } else {
                        this.aiCalculator.executeOrder(currentAiPlayer);
                        gameStore.dispatch(nextPlayer());
                        return;
                    }
                }

                if (currentGamePhase === GamePhase.ACTION_CLEANUP) {
                    gameStore.dispatch(nextPhase());
                    Renderer.rerenderRequired = true;
                    return;
                }
            }

            Renderer.rerenderRequired = false;
        }

        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
    }

    private renderWesterosPhase(currentGamePhase: GamePhase, currentAiPlayer: AiPlayer): boolean {

        let card: WesterosCard;

        switch (currentGamePhase) {
            case GamePhase.WESTEROS1:
                card = this.getWesterosCard(1);
                break;
            case GamePhase.WESTEROS2:
                card = this.getWesterosCard(2);
                break;
            case GamePhase.WESTEROS3:
                card = this.getWesterosCard(3);
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
    }

    private getWesterosCard(cardType: number) {
        let card = GameRules.gameState.currentWesterosCard;

        if (card == null) {
            card = WesterosCardRules.getNextCard(cardType);
            GameRules.gameState.currentWesterosCard = card;
        }
        else if (card !== null && card.state === WesterosCardState.executeCard) {
            if (WesterosCardRules.stillPlayingWesterosCard()) {
                return card;
            }
            else {
                GamePhaseService.switchToNextPhase();
                GameRules.gameState.currentWesterosCard = null;
                card.state = WesterosCardState.played;
                return card;
            }
        }
        GameRules.gameState.currentWesterosCard = card;
        return card;
    }
}