import OrderTokenRenderer from '../ui/renderer/orderTokenRenderer';
import BoardRenderer from '../ui/renderer/boardRenderer';
import TopMenuRenderer from '../ui/topMenu/topMenuRenderer';
import GameState from '../logic/gameStati';
import UnitRenderer from '../ui/renderer/unitRenderer';
import GameRules from '../logic/gameRules';
import {GamePhase} from '../logic/gamePhase';
import Player from '../logic/player';
import {House} from '../logic/house';
import AI from '../logic/ai';
import PowerToken from '../ui/renderer/powerTokenRenderer';
import Renderer from '../ui/utils/renderer';
import WinningModal from '../ui/modals/winningModal';
import {OrderTokenMenuRenderer} from '../ui/renderer/orderTokenMenuRenderer';
import AssetLoader from '../ui/utils/assetLoader';
import CardFactory from '../cards/logic/cardFactory';
import CardAbilities from '../cards/logic/cardAbilities';

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

            if (GameState.getInstance().gamePhase === GamePhase.WESTEROS1) {
                let card = GameRules.playWesterosCard(1);
                CardAbilities[card.functions[0]](GameState.getInstance().westerosCards1);
                Renderer.rerenderRequired = true;
                GameRules.switchToNextPhase();
                return;
            }
            if (GameState.getInstance().gamePhase === GamePhase.WESTEROS2) {
                let card = GameRules.playWesterosCard(2);
                CardAbilities[card.functions[0]]();
                Renderer.rerenderRequired = true;
                GameRules.switchToNextPhase();
                return;
            }
            if (GameState.getInstance().gamePhase === GamePhase.WESTEROS3) {
                let card = GameRules.playWesterosCard(3);
                CardAbilities[card.functions[0]]();
                Renderer.rerenderRequired = true;
                GameRules.switchToNextPhase();
                return;
            }
            if (GameState.getInstance().gamePhase === GamePhase.PLANNING) {
                if (GameRules.isPlanningPhaseComplete()) {
                    GameRules.switchToNextPhase();
                    OrderTokenMenuRenderer.removeOrderTokenMenu();
                    this.orderTokenRenderer.removePlaceHolder();
                    Renderer.rerenderRequired = true;
                    return;
                }

                AI.placeOrderTokens(GameState.getInstance().currentPlayer);
                if (GameRules.planningCompleteForCurrentPlayer()) {
                    Renderer.rerenderRequired = true;
                    GameRules.nextPlayer();
                    return;
                }
                this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer.house);
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                OrderTokenMenuRenderer.renderOrderTokenInMenu(this.game, AssetLoader.getAreaTokens());
            }


            let currentGamePhase = GameState.getInstance().gamePhase;
            if (GameRules.isActionPhase(currentGamePhase)) {
                if (!GameRules.isStillIn(currentGamePhase)) {
                    GameRules.switchToNextPhase();
                    Renderer.rerenderRequired = true;
                }

                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);

                if (GameState.getInstance().currentPlayer.computerOpponent) {
                    AI.executeMoveOrder(GameState.getInstance().currentPlayer);
                    GameRules.nextPlayer();
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (currentGamePhase === GamePhase.ACTION_CONSOLIDATE_POWER) {
                    GameRules.executeAllConsolidatePowerOrders();
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (GameState.getInstance().gamePhase === GamePhase.ACTION_CLEANUP) {
                    GameRules.nextRound();
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

}