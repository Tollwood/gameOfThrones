"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const winston_1 = require("winston");
const express = require("express");
const SocketIO = require("socket.io");
const game_1 = require("./model/game");
const uuid_1 = require("uuid");
const events_1 = require("./model/events");
class ScotlandUnitedServer {
    constructor() {
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.config();
        this.sockets();
        this.listen();
        this.players = new Map();
        this.games = new Map();
    }
    config() {
        this.port = process.env.PORT || ScotlandUnitedServer.PORT;
    }
    sockets() {
        this.io = SocketIO(this.server);
    }
    listen() {
        this.server.listen(ScotlandUnitedServer.PORT, () => {
            winston_1.log('info', `Listening on ${this.port}`);
        });
        this.app.use(express.static(__dirname + '/client/'));
        this.io.on('connect', (socket) => {
            winston_1.log('info', 'Connected client on port %s.', this.port);
            socket.on(events_1.Events.MESSAGE, (m) => {
                winston_1.log('info', '[server](message): %s', JSON.stringify(m));
                this.io.emit(events_1.Events.MESSAGE, m);
            });
            socket.on(events_1.Events.CONNECT_PLAYER, (p) => {
                p.id = socket.id;
                this.players.set(socket.id, p);
                winston_1.log('info', '[server](connectPlayer): %s', JSON.stringify(p));
                this.io.to(socket.id).emit(events_1.Events.PLAYER_CONNECTED, p);
                this.io.emit(events_1.Events.UPDATE_PLAYERS, Array.from(this.players.values()));
                this.io.to(socket.id).emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on('disconnect', () => {
                const gameIdsToDelete = [];
                const player = this.players.get(socket.id);
                this.games.forEach(game => {
                    const indexOfPlayer = game.players.indexOf(player);
                    if (indexOfPlayer > -1) {
                        game.players.splice(indexOfPlayer, 1);
                    }
                    if (game.host.id === player.id) {
                        gameIdsToDelete.push(game.id);
                        winston_1.log('info', 'game %s will be remove because host disconnected', game.id);
                    }
                });
                gameIdsToDelete.forEach(id => this.games.delete(id));
                this.players.delete(socket.id);
                winston_1.log('info', 'Client disconnected');
                this.io.emit(events_1.Events.UPDATE_PLAYERS, Array.from(this.players.values()));
                this.io.emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on(events_1.Events.CREATE_GAME, (name) => {
                const id = uuid_1.v4();
                const game = new game_1.Game(id, name, this.players.get(socket.id), [this.players.get(socket.id)]);
                this.games.set(id, game);
                winston_1.log('info', 'create Game: %s', JSON.stringify(game));
                this.io.emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on(events_1.Events.JOIN_GAME, (id) => {
                const player = this.players.get(socket.id);
                const game = this.games.get(id);
                if (player.id === game.host.id) {
                    winston_1.log('info', 'host can not leave game, cancel instead');
                    return;
                }
                if (game.players.indexOf(player) > -1) {
                    winston_1.log('info', 'Player $s already joined the game', player);
                    return;
                }
                game.players.push(this.players.get(socket.id));
                winston_1.log('info', 'player %s joined game %s', player.id, game.id);
                this.io.emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on(events_1.Events.LEAVE_GAME, (id) => {
                const player = this.players.get(socket.id);
                const game = this.games.get(id);
                if (player.id === game.host.id) {
                    winston_1.log('info', 'host can not leave game, cancel instead');
                    return;
                }
                if (game.players.indexOf(player) === -1) {
                    winston_1.log('info', 'Player $s is not playing', player);
                    return;
                }
                game.players.splice(game.players.indexOf(player), 1);
                winston_1.log('info', 'player %s left game %s', player.id, game.id);
                this.io.emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on(events_1.Events.CANCEL_GAME, (id) => {
                const game = this.games.get(id);
                const player = this.players.get(socket.id);
                if (player.id !== game.host.id) {
                    winston_1.log('info', 'only host can cancel the game');
                    return;
                }
                this.games.delete(id);
                winston_1.log('info', 'host %s canceled Game %s', game.host.id, game.id);
                this.io.emit(events_1.Events.UPDATE_GAMES, Array.from(this.games.values()));
            });
            socket.on(events_1.Events.START_GAME, (id) => {
                const game = this.games.get(id);
                winston_1.log('info', 'game %s started', game.id);
                game.players.forEach(player => this.io.to(player.id).emit(events_1.Events.GAME_STARTED, game));
            });
        });
    }
}
ScotlandUnitedServer.PORT = process.env.PORT || '3000';
exports.ScotlandUnitedServer = ScotlandUnitedServer;
