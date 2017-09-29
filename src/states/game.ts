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
import PowerToken from '../ui/topMenu/powerToken';
import Renderer from '../ui/renderer';

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
        this.unitRenderer.renderUnits(this.game);
        this.game.input.enabled = true;
        this.topMenuRenderer.renderTopMenu(this.game);
        this.topMenuRenderer.renderGameState(this.game);
        this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
        this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer.house);
        PowerToken.renderPowerToken(this.game);
        this.currentGameWidth = window.innerWidth;
    }

    public update() {
        if (this.currentGameWidth !== window.innerWidth) {
            this.topMenuRenderer.renderTopMenu(this.game);
            this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
            this.currentGameWidth = window.innerWidth;
        }

        if (Renderer.rerenderRequired) {
            if (GameState.getInstance().gamePhase === GamePhase.PLANNING) {
                AI.placeOrderTokens();
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
                this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
                if (GameRules.isPlanningPhaseComplete()) {
                    GameRules.startActionPhase();
                    this.topMenuRenderer.renderGameState(this.game);
                }
            }

            if (GameState.getInstance().gamePhase === GamePhase.ACTION) {
                this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);
                this.orderTokenRenderer.removeOrderTokenMenu();
                this.orderTokenRenderer.removePlaceHolder();
                PowerToken.renderPowerToken(this.game);
                if (GameState.getInstance().currentPlayer.computerOpponent) {
                    AI.executeMoveOrder(GameState.getInstance().currentPlayer);
                    Renderer.rerenderRequired = true;
                    return;
                }

                if (GameRules.isActionPhaseComplete()) {
                    GameRules.nextRound();
                    this.topMenuRenderer.renderGameState(this.game);
                    this.orderTokenRenderer.resetOrderTokens(this.game);
                    this.topMenuRenderer.renderGameState(this.game);
                }
            }

            this.unitRenderer.renderUnits(this.game);
            PowerToken.renderControlToken(this.game);
            Renderer.rerenderRequired = false;
        }

        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
    }

}