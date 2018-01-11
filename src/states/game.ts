import OrderTokenRenderer from '../ui/orderToken/orderTokenRenderer';
import BoardRenderer from '../ui/board/boardRenderer';
import TopMenuRenderer from '../ui/board/topMenu/topMenuRenderer';
import UnitRenderer from '../ui/units/unitRenderer';
import GameRules from '../logic/board/gameRules/gameRules';
import WinningModal from '../ui/board/winningModal';
import {OrderTokenMenuRenderer} from '../ui/orderToken/orderTokenMenuRenderer';
import AssetLoader from '../utils/assetLoader';
import RecruitingRenderer from '../ui/units/recruitingRenderer';
import AiCalculator from '../logic/ai/aiCalculator';
import PowerTokenRenderer from '../ui/orderToken/powerTokenRenderer';
import Renderer from '../utils/renderer';
import {WesterosCardRenderer} from '../ui/cards/westerosCardRenderer';

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
    private westerosCardRenderer: WesterosCardRenderer;

    constructor() {
        super();
        this.orderTokenRenderer = new OrderTokenRenderer();
        this.boardRenderer = new BoardRenderer();
        this.powerTokenRenderer = new PowerTokenRenderer();
        this.unitRenderer = new UnitRenderer();
        this.aiCalculator = new AiCalculator();
        this.recruitingRenderer = new RecruitingRenderer();
        this.orderTokenMenuRenderer = new OrderTokenMenuRenderer();
        this.westerosCardRenderer = new WesterosCardRenderer();
    }

    public preload() {
        AssetLoader.loadAssets(this.game);
    }

    public create(): void {
        this.game.input.enabled = true;
        this.currentGameWidth = window.innerWidth;
        const renderer = new Renderer(this.game);
        AssetLoader.createAssets(this.game);
        BoardRenderer.renderBoard(this.game);
        this.topMenuRenderer = new TopMenuRenderer(this.game);
        this.unitRenderer.init(this.game);
        this.orderTokenRenderer.init(renderer);
        this.recruitingRenderer.init(renderer);
        this.powerTokenRenderer.init(this.game);
        this.westerosCardRenderer.init(renderer);
        renderer.initGameLayers();
        this.orderTokenMenuRenderer.init(renderer);
        this.winningModal = new WinningModal(renderer);
        GameRules.newGame();
    }

    public update() {
        if (this.currentGameWidth !== window.innerWidth) {
            this.currentGameWidth = window.innerWidth;
        }
        // TODO render based on gameState
        this.topMenuRenderer.renderTopMenu(this.game);
        this.boardRenderer.handleNavigationOnMap(this.game);
        this.boardRenderer.handleZoom(this.game);
    }
}