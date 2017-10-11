import OrderTokenRenderer from '../orderToken/ui/orderTokenRenderer';
import BoardRenderer from '../board/ui/boardRenderer';
import TopMenuRenderer from '../board/ui/topMenu/topMenuRenderer';
import GameState from '../board/logic/gameStati';
import UnitRenderer from '../units/ui/unitRenderer';
import GameRules from '../board/logic/gameRules';
import {GamePhase} from '../board/logic/gamePhase';
import Player from '../board/logic/player';
import {House} from '../board/logic/house';
import AI from '../ai/ai';
import PowerToken from '../orderToken/ui/powerTokenRenderer';
import Renderer from '../utils/renderer';
import WinningModal from '../board/ui/winningModal';
import {OrderTokenMenuRenderer} from '../orderToken/ui/orderTokenMenuRenderer';
import AssetLoader from '../utils/assetLoader';
import CardFactory from '../cards/logic/cardFactory';
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
        GameState.initGame([new Player(House.stark, 5, false, CardFactory.getHouseCards(House.stark)), new Player(House.lannister, 5, true, CardFactory.getHouseCards(House.lannister)), new Player(House.baratheon, 5, true, CardFactory.getHouseCards(House.baratheon)), new Player(House.greyjoy, 5, true, CardFactory.getHouseCards(House.greyjoy)), new Player(House.tyrell, 5, true, CardFactory.getHouseCards(House.tyrell)), new Player(House.martell, 5, true, CardFactory.getHouseCards(House.martell))]);
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
            if (currentGamePhase === GamePhase.WESTEROS1) {
                let rerenderRequired = this.playWesterosCard(1, GameState.getInstance().westerosCards1);
                if(rerenderRequired){
                    Renderer.rerenderRequired = true;
                    return;
                }
                RecruitingRenderer.highlightPossibleArea(this.game);
                AI.recruit(GameRules.getAreasAllowedToRecruit());
            }
            if (currentGamePhase === GamePhase.WESTEROS2) {
                let rerenderRequired  = this.playWesterosCard(2, GameState.getInstance().westerosCards2);
                if(rerenderRequired){
                    Renderer.rerenderRequired = true;
                    return;
                }
            }
            if (currentGamePhase === GamePhase.WESTEROS3) {
                let rerenderRequired  = this.playWesterosCard(3, GameState.getInstance().westerosCards3);
                if(rerenderRequired){
                    Renderer.rerenderRequired = true;
                    return;
                }
            }

            if (currentGamePhase === GamePhase.PLANNING) {
                if (GamePhaseService.isPlanningPhaseComplete()) {
                    GamePhaseService.switchToNextPhase();
                    OrderTokenMenuRenderer.removeOrderTokenMenu();
                    this.orderTokenRenderer.removePlaceHolder();
                    Renderer.rerenderRequired = true;
                    return;
                }
                // human interaction
                this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer.house);
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                OrderTokenMenuRenderer.renderOrderTokenInMenu(this.game, AssetLoader.getAreaTokens());

                // AI interaction
                AI.placeAllOrderTokens(GameState.getInstance().currentPlayer);

                //
                if (GamePhaseService.planningCompleteForCurrentPlayer()) {
                    Renderer.rerenderRequired = true;
                    GamePhaseService.nextPlayer();
                    return;
                }

            }

            if (GamePhaseService.isActionPhase(currentGamePhase)) {
                if (!GamePhaseService.isStillIn(currentGamePhase)) {
                    GamePhaseService.switchToNextPhase();
                    Renderer.rerenderRequired = true;
                }

                // human interaction
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);

                // AI interaction
                if (GameState.getInstance().currentPlayer.computerOpponent) {
                    AI.executeMoveOrder(GameState.getInstance().currentPlayer);
                    GamePhaseService.nextPlayer();
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (currentGamePhase === GamePhase.ACTION_CONSOLIDATE_POWER) {
                    GameRules.executeAllConsolidatePowerOrders();
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (GameState.getInstance().gamePhase === GamePhase.ACTION_CLEANUP) {
                    GamePhaseService.nextRound();
                    Renderer.rerenderRequired = true;
                    return;
                }
            }
            let winningHouse = GameRules.getWinningHouse();
            if (winningHouse !== null) {
                WinningModal.showWinningModal(this.game, winningHouse);
            }

            Renderer.rerenderRequired = false;
        }

        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
    }

    private playWesterosCard(type: number, cards: Array<WesterosCard>): boolean {
        let card = GameRules.getWesterosCard(type);
        if (card.state === WesterosCardState.showCard) {
            WesterosCardModal.showModal(this.game, card, cards);
            card.state = WesterosCardState.executeCard;
        }
        return card.state === WesterosCardState.played;
    }
}