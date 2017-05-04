import {OrderTokenService} from "../ui/orderToken";
import {Board} from "../ui/board";
import {TopMenu} from "../ui/topMenu/topMenu";
import {GameState} from "../logic/gameStati";
import {UnitRenderer} from "../ui/unitRenderer";
import {GameRules} from "../logic/gameRules";

import game = PIXI.game;

export default class Game extends Phaser.State {
    private orderTokenService: OrderTokenService;
    private boardService: Board;
    private topMenu: TopMenu;
    private currentGameWidth: number;
    private unitRenderer: UnitRenderer;

    constructor() {
        super();
        this.orderTokenService = new OrderTokenService();
        this.boardService = new Board();
        this.topMenu = new TopMenu();
        this.unitRenderer = new UnitRenderer();
    }

    public preload() {
        Board.loadAssets(this.game);
        this.orderTokenService.loadAssets(this.game);
        this.topMenu.loadAssets(this.game);
        this.unitRenderer.loadAssets(this.game);

    }

    public create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        Board.createBoard(this.game);
        this.unitRenderer.renderUnits(this.game);
        this.orderTokenService.addPlanningLayer(this.game);
        this.topMenu.draw(this.game);
        this.orderTokenService.creatOrderTokens(this.game);
        this.game.input.enabled = true;
        this.currentGameWidth = window.innerWidth;
        this.game.add.text(0, 0, GameState.getInstance().gamePhase + '', 'Arial');
    }

    public update() {
        this.boardService.handleNavigationOnMap(this.game);
        this.boardService.handleZoom(this.game);
        if (this.currentGameWidth !== window.innerWidth) {
            this.topMenu.draw(this.game);
            this.currentGameWidth = window.innerWidth;
        }

        if (this.game.input.keyboard.isDown(Phaser.KeyCode.N)) {
            GameState.getInstance().nextRound();
        }
        if (GameRules.allOrderTokenPlaced()) {
            GameRules.nextRound();
            this.orderTokenService.resetOrderTokens(this.game);
        }
    }

}