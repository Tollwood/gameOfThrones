import {Player} from './player';

export class Message {

  from: Player;
  content: string;

  constructor(content: string, from: Player) {
    this.content = content;
    this.from = from;
  }

}
