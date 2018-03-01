import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from '../../../../server/model/player';
import {Message} from '../../../../server/model/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit {

  @Input() connectedPlayers: Player[];
  @Input() localPlayer: Player;
  @Input() messages: Message[];
  @Output() onSendMessage = new EventEmitter<Message>();

  message: Message;

  ngOnInit(): void {
    this.message = new Message('', this.localPlayer);
  }

  sendMessage(): void {
    this.onSendMessage.emit(this.message);
    this.message.content = '';
  }

}
