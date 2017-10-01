import OrderTokenRenderer from '../ui/orderTokenRenderer';
import BoardRenderer from '../ui/boardRenderer';
import TopMenuRenderer from '../ui/topMenu/topMenuRenderer';
import GameState from '../logic/gameStati';
import UnitRenderer from '../ui/unitRenderer';
import GameRules from '../logic/gameRules';
import {GamePhase} from '../logic/gamePhase';
import Player from '../logic/player';
import {House} from '../logic/house';
import AI from '../logic/ai';
import PowerToken from '../ui/topMenu/powerTokenRenderer';
import Renderer from '../ui/renderer';
import WinningModal from '../ui/modals/winningModal';

import game = PIXI.game;

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
        BoardRenderer.loadAssets(this.game);
        this.orderTokenRenderer.loadAssets(this.game);
        this.topMenuRenderer.loadAssets(this.game);
        this.unitRenderer.loadAssets(this.game);
        PowerToken.loadAssets(this.game);
    }

    public create(): void {
        GameState.initGame([new Player(House.stark, 5, false), new Player(House.lannister, 5, true), new Player(House.baratheon, 5, true), new Player(House.greyjoy, 5, true), new Player(House.tyrell, 5, true), new Player(House.martell, 5, true)]);
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
            this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
            this.currentGameWidth = window.innerWidth;
        }

        if (Renderer.rerenderRequired) {
            this.topMenuRenderer.renderTopMenu(this.game);
            this.topMenuRenderer.renderGameState(this.game);
            PowerToken.renderPowerToken(this.game);
            PowerToken.renderControlToken(this.game);
            this.unitRenderer.renderUnits(this.game);

            if (GameState.getInstance().gamePhase === GamePhase.PLANNING) {
                AI.placeOrderTokens();
                this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer.house);
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
                if (GameRules.isPlanningPhaseComplete()) {
                    GameRules.startActionPhase();
                    this.orderTokenRenderer.removeOrderTokenMenu();
                    this.orderTokenRenderer.removePlaceHolder();
                    Renderer.rerenderRequired = true;
                    return;
                }
            }

            if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);

                if (GameState.getInstance().currentPlayer.computerOpponent) {
                    AI.executeMoveOrder(GameState.getInstance().currentPlayer);
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (GameRules.isActionPhaseComplete()) {
                    GameRules.nextRound();
                    Renderer.rerenderRequired = true;
                    this.orderTokenRenderer.resetOrderTokens(this.game);
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