import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export default class Preloader extends Phaser.State {
  private game: Phaser.Game;

  public preload(): void {
    this.startGame();
  }

  private startGame(): void {
    this.game.camera.onFadeComplete.addOnce(this.loadTitle, this);
    this.game.camera.fade(0x000000, 1000);
  }

  private loadTitle(): void {
    this.game.state.start('game');
  }
}
