import OrderTokenRenderer from './orderToken/orderTokenRenderer';
import BoardRenderer from './board/boardRenderer';
import UnitRenderer from './units/unitRenderer';
import WinningModal from './board/winningModal';
import {OrderTokenMenuRenderer} from './orderToken/orderTokenMenuRenderer';
import AssetLoader from '../../utils/assetLoader';
import RecruitingRenderer from './units/recruitingRenderer';
import PowerTokenRenderer from './orderToken/powerTokenRenderer';
import Renderer from '../../utils/renderer';
import {WesterosCardRenderer} from './cards/westerosCardRenderer';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {ActionFactory, GameStoreFactory, GameStoreState, House, PlayerSetup} from 'got-store';
import {AiCalculator} from 'got-ai';
import {Store} from 'redux';

export default class Game extends Phaser.State {
  private orderTokenRenderer: OrderTokenRenderer;
  private boardRenderer: BoardRenderer;
  private powerTokenRenderer: PowerTokenRenderer;
  private currentGameWidth: number;
  private unitRenderer: UnitRenderer;
  private recruitingRenderer: RecruitingRenderer;
  private winningModal: WinningModal;
  private orderTokenMenuRenderer: OrderTokenMenuRenderer;
  private westerosCardRenderer: WesterosCardRenderer;
  private game: Phaser.Game;
  private gameStore: Store<GameStoreState>;

  constructor() {
    super();
    this.game;
    this.gameStore = GameStoreFactory.create();
    this.orderTokenRenderer = new OrderTokenRenderer();
    this.boardRenderer = new BoardRenderer();
    this.powerTokenRenderer = new PowerTokenRenderer();
    this.unitRenderer = new UnitRenderer();
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
    this.unitRenderer.init(this.gameStore, this.game);
    this.orderTokenRenderer.init(this.gameStore, renderer);
    this.recruitingRenderer.init(this.gameStore, renderer);
    this.powerTokenRenderer.init(this.gameStore, renderer);
    this.westerosCardRenderer.init(this.gameStore, renderer);
    renderer.initGameLayers();
    this.orderTokenMenuRenderer.init(this.gameStore, renderer);
    this.winningModal = new WinningModal(this.gameStore, renderer);

    const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];

    playerSetup.forEach((playerSetup) => {
      if (playerSetup.ai) {
        this.gameStore.subscribe(() => {
          AiCalculator.recruit(this.gameStore, playerSetup.house);
          AiCalculator.placeAllOrderTokens(this.gameStore, playerSetup.house);
          AiCalculator.executeOrder(this.gameStore, playerSetup.house);
        });
      }
    });

    this.gameStore.dispatch(ActionFactory.newGame(playerSetup));

  }

  public update() {
    if (this.currentGameWidth !== window.innerWidth) {
      this.currentGameWidth = window.innerWidth;
    }
    this.boardRenderer.handleNavigationOnMap(this.game);
    this.boardRenderer.handleZoom(this.game);
  }
}
