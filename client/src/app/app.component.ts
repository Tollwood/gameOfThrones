import {Component, OnInit} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {Player} from '../../../server/src/model/player';
import {Message} from '../../../server/src/model/message';
import {Game} from '../../../server/src/model/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WebSocketService]
})
export class AppComponent implements OnInit {

  singlePlayer: boolean = false;
  private wsService: WebSocketService;
  // Application state
  private localPlayer: Player;
  private messages: Message[] = [];
  private players: Player[] = [];
  private games: Game[] = [];
  private currentGame: Game;

  constructor(webSocketService: WebSocketService) {
    this.wsService = webSocketService;
  }

  ngOnInit(): void {
    this.wsService.onMessage()
      .subscribe((message: Message) => {
        if (this.messages.length == 10) {
          this.messages.shift();
        }
        this.messages.push(message);
      });

    this.wsService.onUpdatePlayers()
      .subscribe((players: Player[]) => {
        this.players = players;
      });

    this.wsService.onUpdateGames()
      .subscribe((games: Game[]) => {
        this.games = games;
        if (this.currentGame && !games.find(game => this.currentGame.id === game.id)) {
          this.currentGame = null;
        }
      });

    this.wsService.onGameStarted()
      .subscribe((game: Game) => {
        this.currentGame = game;
      });

    this.wsService.onPlayerConnected().subscribe((p: Player) => this.localPlayer = p);
  }

  onLoggedIn(player: Player) {
    this.localPlayer = player;
    this.wsService.connect(player);
  }

  onSendMessage(message: Message) {
    this.wsService.sendMessage(message);
  }

  onCreateGame(name: string) {
    this.wsService.createGame(name);
  }

  onCancelGame(id: string) {
    this.wsService.cancelGame(id);
  }

  onJoinGame(id: string) {
    this.wsService.joinGame(id);
  }

  onLeaveGame(id: string) {
    this.wsService.leaveGame(id);
  }

  onStartGame(id: string) {
    this.wsService.startGame(id);
  }

  onCloseGame(id: string) {
    if (this.localPlayer.id === this.currentGame.host.id) {
      this.wsService.cancelGame(id);
    }
    else {
      this.wsService.leaveGame(id);
      this.currentGame = null;
    }

  }

  startSinglePlayerGame() {
    this.singlePlayer = true;
  }
}
