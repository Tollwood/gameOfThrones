import {Player} from './player';

export class Game {

  constructor(public id: string, public name: string, public host: Player, public players: Player[]) {
  }

}
