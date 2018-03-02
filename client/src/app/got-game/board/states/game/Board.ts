import OrderTokenRenderer from './orderToken/orderTokenRenderer';
import BoardRenderer from './board/boardRenderer';
import UnitRenderer from './units/unitRenderer';
import WinningModal from './board/winningModal';
import {OrderTokenMenuRenderer} from './orderToken/orderTokenMenuRenderer';
import AssetLoader from '../../utils/assetLoader';
import RecruitingRenderer from './units/recruitingRenderer';
import Renderer from '../../utils/renderer';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {GameLogic} from 'got-store'

class Board extends Phaser.State {
  private orderTokenRenderer: OrderTokenRenderer;
  private boardRenderer: BoardRenderer;
  private currentGameWidth: number;
  private unitRenderer: UnitRenderer;
  private recruitingRenderer: RecruitingRenderer;
  private winningModal: WinningModal;
  private orderTokenMenuRenderer: OrderTokenMenuRenderer;
  private game: Phaser.Game;
  private gameLogic: GameLogic;

  constructor(gameLogic: GameLogic) {
    super();
    this.game;
    this.gameLogic = gameLogic;
    this.orderTokenRenderer = new OrderTokenRenderer();
    this.boardRenderer = new BoardRenderer();
    this.unitRenderer = new UnitRenderer();
    this.recruitingRenderer = new RecruitingRenderer();
    this.orderTokenMenuRenderer = new OrderTokenMenuRenderer();
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
    renderer.initGameLayers();
    this.unitRenderer.init(this.gameLogic, this.game);
    this.orderTokenRenderer.init(this.gameLogic, renderer);
    this.recruitingRenderer.init(this.gameLogic, renderer);
    this.orderTokenMenuRenderer.init(this.gameLogic, renderer);
    this.winningModal = new WinningModal(this.gameLogic, renderer);

  }

  public update() {
    if (this.currentGameWidth !== window.innerWidth) {
      this.currentGameWidth = window.innerWidth;
    }
    this.boardRenderer.handleNavigationOnMap(this.game);
    this.boardRenderer.handleZoom(this.game);
  }
}

export {Board}
