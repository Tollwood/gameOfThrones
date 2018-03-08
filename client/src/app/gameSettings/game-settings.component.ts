import {Component, OnInit} from '@angular/core';
import {Player} from '../../../../server/model/player';
import {WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent {

  private clans: string[] = [
    'James Douglas, Lord of Douglas',
    'Patrick V, Earl of March',
    'Donnchadh IV, Earl of Fife',
    'William de Moravia, 3rd Earl of Sutherland',
    'MacDonald',
    'John "the Red" Comyn'];
}
