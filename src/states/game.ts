import {OrderTokenService} from "../others/orderToken";
import {BoardService} from "../others/board";
import game = PIXI.game;

export default class Game extends Phaser.State {
    private orderTokenService: OrderTokenService;
    private boardService: BoardService;

    constructor() {
        super();
        this.orderTokenService = new OrderTokenService();
        this.boardService = new BoardService();
    }

    public preload() {
        BoardService.loadAssets(this.game);
        this.orderTokenService.loadAssets(this.game);

    }

    public create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        BoardService.createBoard(this.game);
        this.orderTokenService.addPlanningLayer(this.game);
        this.orderTokenService.creatOrderTokens(this.game);
        this.game.input.enabled = true;
    }

    public update() {
        this.boardService.handleNavigationOnMap(this.game);
        this.boardService.handleZoom(this.game);
    }

}