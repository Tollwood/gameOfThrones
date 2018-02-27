import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Message} from '../../../server/src/model/message';
import {Player} from '../../../server/src/model/player';
import {Events} from '../../../server/src/model/events';
import {Game} from '../../../server/src/model/game';

@Injectable()
export class WebSocketService {
  private SERVER_URL: string = 'http://localhost:3000';
  private socket: SocketIOClient.Socket;
  private localPlayer: Player;

  constructor() {
    this.socket = socketIo(this.SERVER_URL);
  }

  public connect(player: Player) {
    this.socket.emit(Events.CONNECT_PLAYER, player);
  }

  public onPlayerConnected(): Observable<Player> {
    return new Observable<Player>(observer => {
      this.socket.on(Events.PLAYER_CONNECTED, (data: Player) => {
        this.localPlayer = data;
        observer.next(data);
      });
    });
  }

  public onUpdatePlayers(): Observable<Array<Player>> {
    return new Observable<Array<Player>>(observer => {
      this.socket.on(Events.UPDATE_PLAYERS, (data: Array<Player>) => observer.next(data));
    });
  }

  public sendMessage(message: Message) {
    this.socket.emit(Events.MESSAGE, message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on(Events.MESSAGE, (data: Message) => observer.next(data));
    });
  }

  public createGame(name: string) {
    this.socket.emit(Events.CREATE_GAME, name);
  }

  public joinGame(gameId: string) {
    this.socket.emit(Events.JOIN_GAME, gameId);
  }

  public leaveGame(gameId: string) {
    this.socket.emit(Events.LEAVE_GAME, gameId);
  }

  public cancelGame(gameId: string) {
    this.socket.emit(Events.CANCEL_GAME, gameId);
  }

  public onUpdateGames(): Observable<Array<Game>> {
    return new Observable<Array<Game>>(observer => {
      this.socket.on(Events.UPDATE_GAMES, (data: Array<Game>) => observer.next(data));
    });
  }

  public onGameStarted() {
    return new Observable<Game>(observer => {
      this.socket.on(Events.GAME_STARTED, (data: Game) => observer.next(data));
    });
  }

  public startGame(gameId: string) {
    this.socket.emit(Events.START_GAME, gameId);
  }

  public getLocalPlayer() {
    return this.localPlayer;
  }
}
