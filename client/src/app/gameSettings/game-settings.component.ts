import {Component, OnInit} from '@angular/core';
import {Player} from '../../../../server/model/player';
import {WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent {

  private clans: string[] = ['Bruce','Wallace', 'MacKenzie','Clan4','Clan5','Clan6'];
}
