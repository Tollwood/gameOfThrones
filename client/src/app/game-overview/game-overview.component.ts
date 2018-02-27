import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game} from '../../../../server/src/model/game';
import {Player} from '../../../../server/src/model/player';

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent implements OnInit {

  @Input() localPlayer: Player;
  @Input() games: Game[];
  @Output() onCreateGame = new EventEmitter<string>();
  @Output() onCancelGame = new EventEmitter<string>();
  @Output() onJoinGame = new EventEmitter<string>();
  @Output() onLeaveGame = new EventEmitter<string>();
  @Output() onStartGame = new EventEmitter<string>();

  private title: string;
  private isShowNewGameForm: boolean;

  constructor() {
  }

  ngOnInit() {
    this.games = [];
    this.title = "Current Games";
  }

  toggleShowGameForm() {
    this.isShowNewGameForm = !this.isShowNewGameForm;
  }

  createNewGame(name: string) {
    this.onCreateGame.emit(name);
    this.isShowNewGameForm = false;
  }

  cancelGame(id: string) {
    this.onCancelGame.emit(id);
  }

  joinGame(id: string) {
    this.onJoinGame.emit(id);
  }

  leaveGame(id: string) {
    this.onLeaveGame.emit(id);
  }

  startGame(id: string) {
    this.onStartGame.emit(id);
  }

  canCancelGame(game: Game) {
    return JSON.stringify(game.host) === JSON.stringify(this.localPlayer);
  }

  canJoinGame(game: Game) {
    return JSON.stringify(game.host) !== JSON.stringify(this.localPlayer) && !game.players.find(player => player.id === this.localPlayer.id);
  }

  canLeaveGame(game: Game) {
    return JSON.stringify(game.host) !== JSON.stringify(this.localPlayer) && game.players.find(player => player.id === this.localPlayer.id);
  }

  canCreateNewGame() {
    return !this.games.find(game => game.host.id === this.localPlayer.id);
  }

  canStartGame(game: Game) {
    return JSON.stringify(game.host) === JSON.stringify(this.localPlayer);
  }
}
