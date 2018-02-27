import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import {Game} from '../../../../server/src/model/game';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnChanges {

  @Input() game: Game;
  phaserGame: Phaser.Game;

  @Output() onCloseGame = new EventEmitter<string>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['game'].currentValue && this.phaserGame) {
      this.phaserGame.destroy();
    }
    if (changes['game'].currentValue && !changes['game'].previousValue) {
      this.startGame(<Game>changes['game'].currentValue);
    }

  }

  ngOnInit() {

  }

  startGame(game: Game) {
    this.phaserGame = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder', {
      create: () => {
        this.create(game.name);
      }
    });
  }

  create(gameName: string) {
    var text = gameName;
    var style = {font: "65px Arial", fill: "#ff0044", align: "center"};
    this.phaserGame.add.text(this.phaserGame.world.centerX - 300, 0, text, style);
  }

  closeGame() {
    this.onCloseGame.emit(this.game.id);
  }

  shouldShowMenu() {
    return this.game;
  }
}
