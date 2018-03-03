import {Component, OnInit} from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import {GameLogic, GameLogicFactory, House, PlayerSetup} from 'got-store';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {Player, State} from 'got-store/dist';

@Component({
  selector: 'app-got-game',
  templateUrl: './got-game.component.html',
  styleUrls: ['./got-game.component.scss']
})
export class GotGameComponent implements OnInit {
  private id: string;
  localPlayer: Player;
  localState: State;
  gameLogic: GameLogic;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.localPlayer = new Player(House.stark, 10);
    const playerSetup: PlayerSetup[] = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
    this.startGame(playerSetup);
  }

  closeGame() {
    if (this.id === 'local') {
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(['/lobby']);
  }


  private startGame(playerSetup: PlayerSetup[]) {
    this.gameLogic = GameLogicFactory.create(playerSetup, true);
    this.localState = this.gameLogic.getState();
    this.gameLogic.subscribe(() => {
      this.localState = this.gameLogic.getState();
    });
  }
}

