import {createServer, Server} from 'http';
import {log} from 'winston';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import {Game} from './model/game';
import {Player} from './model/player';
import {v4 as uuid} from 'uuid';
import {Events} from './model/events';

export class ScotlandUnitedServer {

  private static readonly PORT = process.env.PORT || '3000';
  private app: express.Express;
  private server: Server;
  private port: string | number;
  private io: SocketIO.Server;
  private players: Map<string, Player>;
  private games: Map<string, Game>;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.config();
    this.sockets();
    this.listen();
    this.players = new Map<string, Player>();
    this.games = new Map<string, Game>();
  }

  private config(): void {
    this.port = process.env.PORT || ScotlandUnitedServer.PORT;
  }

  private sockets(): void {
    this.io = SocketIO(this.server);
  }

  private listen(): void {
    this.server.listen(ScotlandUnitedServer.PORT, () => {
      log('info', `Listening on ${this.port}`);
    });

    this.app.get('/', function (req, res) {
      res.sendFile(__dirname + '/index.html');
    });

    this.io.on('connect', (socket: SocketIO.Socket) => {
      log('info', 'Connected client on port %s.', this.port);
      socket.on(Events.MESSAGE, (m: String) => {
        log('info', '[server](message): %s', JSON.stringify(m));
        this.io.emit(Events.MESSAGE, m);
      });

      socket.on(Events.CONNECT_PLAYER, (p: Player) => {
        p.id = socket.id;
        this.players.set(socket.id, p);
        log('info', '[server](connectPlayer): %s', JSON.stringify(p));
        this.io.to(socket.id).emit(Events.PLAYER_CONNECTED, p);
        this.io.emit(Events.UPDATE_PLAYERS, Array.from(this.players.values()));
        this.io.to(socket.id).emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });

      socket.on('disconnect', () => {
        const gameIdsToDelete: string[] = [];
        const player = this.players.get(socket.id);
        this.games.forEach(game => {
          const indexOfPlayer = game.players.indexOf(player);
          if (indexOfPlayer > -1) {
            game.players.splice(indexOfPlayer, 1);
          }
          if (game.host.id === player.id) {
            gameIdsToDelete.push(game.id);
            log('info', 'game %s will be remove because host disconnected', game.id);
          }
        });
        gameIdsToDelete.forEach(id => this.games.delete(id));
        this.players.delete(socket.id);
        log('info', 'Client disconnected');
        this.io.emit(Events.UPDATE_PLAYERS, Array.from(this.players.values()));
        this.io.emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });


      socket.on(Events.CREATE_GAME, (name: string) => {
        const id: string = uuid();
        const game = new Game(id, name, this.players.get(socket.id), [this.players.get(socket.id)]);
        this.games.set(id, game);
        log('info', 'create Game: %s', JSON.stringify(game));
        this.io.emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });

      socket.on(Events.JOIN_GAME, (id: string) => {
        const player = this.players.get(socket.id);
        const game = this.games.get(id);
        if (player.id === game.host.id) {
          log('info', 'host can not leave game, cancel instead');
          return;
        }
        if (game.players.indexOf(player) > -1) {
          log('info', 'Player $s already joined the game', player);
          return;
        }
        game.players.push(this.players.get(socket.id));
        log('info', 'player %s joined game %s', player.id, game.id);
        this.io.emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });

      socket.on(Events.LEAVE_GAME, (id: string) => {
        const player = this.players.get(socket.id);
        const game = this.games.get(id);
        if (player.id === game.host.id) {
          log('info', 'host can not leave game, cancel instead');
          return;
        }
        if (game.players.indexOf(player) === -1) {
          log('info', 'Player $s is not playing', player);
          return;
        }
        game.players.splice(game.players.indexOf(player), 1);
        log('info', 'player %s left game %s', player.id, game.id);
        this.io.emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });

      socket.on(Events.CANCEL_GAME, (id: string) => {
        const game = this.games.get(id);
        const player = this.players.get(socket.id);
        if (player.id !== game.host.id) {
          log('info', 'only host can cancel the game');
          return;
        }
        this.games.delete(id);
        log('info', 'host %s canceled Game %s', game.host.id, game.id);
        this.io.emit(Events.UPDATE_GAMES, Array.from(this.games.values()));
      });

      socket.on(Events.START_GAME, (id: string) => {
        const game = this.games.get(id);
        log('info', 'game %s started', game.id);
        game.players.forEach(player => this.io.to(player.id).emit(Events.GAME_STARTED, game));
      });
    });
  }
}
