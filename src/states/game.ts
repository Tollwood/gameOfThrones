import OrderTokenRenderer from '../ui/orderTokenRenderer';
import BoardRenderer from '../ui/boardRenderer';
import TopMenuRenderer from '../ui/topMenu/topMenuRenderer';
import GameState from '../logic/gameStati';
import UnitRenderer from '../ui/unitRenderer';
import GameRules from '../logic/gameRules';
import {GamePhase} from '../logic/gamePhase';

import game = PIXI.game;
import Player from "../logic/player";
import {House} from "../logic/house";
import AI from "../logic/ai";

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
    }

    public create(): void {
        GameState.initGame([new Player(House.stark,5, false),new Player(House.lannister,5, true),new Player(House.baratheon,5, true),new Player(House.greyjoy,5, true), new Player(House.tyrell,5, true),new Player(House.martell,5, true)]);
        BoardRenderer.renderBoard(this.game);
        this.orderTokenRenderer.createGroups(this.game);
        this.game.input.enabled = true;
        this.topMenuRenderer.renderTopMenu(this.game);
        this.topMenuRenderer.renderGameState(this.game);
        this.unitRenderer.renderUnits(this.game);
        this.orderTokenRenderer.renderOrderTokenInMenu(this.game);
        this.orderTokenRenderer.renderPlaceHolderForOrderToken(this.game, GameState.getInstance().currentPlayer);
        this.currentGameWidth = window.innerWidth;
    }

    public update() {
        if (this.currentGameWidth !== window.innerWidth) {
            this.topMenuRenderer.renderTopMenu(this.game);
            this.currentGameWidth = window.innerWidth;
        }

        if(GameState.getInstance().gamePhase == GamePhase.PLANNING){
            AI.placeOrderTokens();
            this.orderTokenRenderer.renderPlacedOrderTokens(this.game, false);
        }

        if(GameState.getInstance().gamePhase == GamePhase.ACTION){
            this.orderTokenRenderer.renderPlacedOrderTokens(this.game, true);
            GameState.getInstance().areas.map((area) => {AI.executeMoveOrder(area);});

        }

        if (GameRules.isPlanningPhaseComplete()) {
            GameRules.switchToPhase(GamePhase.ACTION);
            this.topMenuRenderer.renderGameState(this.game);
        }

        if (GameRules.isActionPhaseComplete()) {
            GameRules.switchToPhase(GamePhase.PLANNING);
            GameRules.nextRound();
            this.topMenuRenderer.renderGameState(this.game);
            this.orderTokenRenderer.resetOrderTokens(this.game);
            this.topMenuRenderer.renderGameState(this.game);
        }

        this.topMenuRenderer.renderPowerToken(this.game);
        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
        this.unitRenderer.renderUnits(this.game);
    }

}