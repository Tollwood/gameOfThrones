import OrderTokenRenderer from '../ui/orderTokenRenderer';
import BoardRenderer from '../ui/boardRenderer';
import TopMenuRenderer from '../ui/topMenu/topMenuRenderer';
import GameState from '../logic/gameStati';
import UnitRenderer from '../ui/unitRenderer';
import GameRules from '../logic/gameRules';
import {GamePhase} from '../logic/gamePhase';

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
    }

    public create(): void {
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

        if (GameRules.isPlanningPhaseComplete()) {
            GameRules.switchToPhase(GamePhase.ACTION);
        }

        if (GameRules.isActionPhaseComplete()) {
            GameRules.switchToPhase(GamePhase.PLANNING);
            GameRules.nextRound();
            this.orderTokenRenderer.resetOrderTokens(this.game);
            this.topMenuRenderer.renderGameState(this.game);
        }

        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
        this.unitRenderer.renderUnits(this.game);
    }

}