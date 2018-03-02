import {Component, OnInit} from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import {Board} from './board/states/game/Board';
import Preloader from './board/states/preloader';
import {GameLogic, GameLogicFactory, House, PlayerSetup} from 'got-store';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {Area, AreaStatsService, Player, State} from 'got-store/dist';

@Component({
  selector: 'app-got-game',
  templateUrl: './got-game.component.html',
  styleUrls: ['./got-game.component.scss']
})
export class GotGameComponent implements OnInit {
  private id: string;
  localPlayer: Player;
  castle: number;
  gameRound: number;
  wildlingCount: number;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.localPlayer = new Player(House.stark, 10);
    this.startGame();
  }


  closeGame() {
    if (this.id === 'local') {
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(['/lobby']);
  }

  private startGame() {
    const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
    const gameLogic: GameLogic = GameLogicFactory.create(playerSetup, true);
    this.updateTopMenu(gameLogic.getState());
    gameLogic.subscribe(() => {
      this.updateTopMenu(gameLogic.getState());
    });
    const board = new Board(gameLogic);

    const game: Phaser.Game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameHolder');
    game.state.add('preloader', Preloader);
    game.state.start('preloader');
    game.state.add('game', board);
    return game;
  }

  private updateTopMenu(state: State) {
    this.gameRound = state.gameRound;
    this.wildlingCount = state.wildlingsCount;
    this.localPlayer = state.players.find((player) => this.localPlayer.house === player.house);
    this.castle = Array.from(state.areas.values())
      .filter((area: Area) => area.controllingHouse === this.localPlayer.house)
      .map((area: Area) => {
        const value: number = AreaStatsService.getInstance().areaStats.get(area.key).hasCastleOrStronghold() ? 1 : 0;
        return value;
      })
      .reduce((a, b) => a + b);
  }
}
