import {Component, OnInit} from '@angular/core';
import {Player} from '../../../../server/src/model/player';
import {WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  private wsService: WebSocketService;
  // Application state
  private localPlayer: Player;

  constructor(webSocketService: WebSocketService) {
    this.wsService = webSocketService;
  }

  ngOnInit(): void {
    this.localPlayer = this.wsService.getLocalPlayer();
    this.wsService.onPlayerConnected().subscribe((p: Player) => this.localPlayer = p);
  }

  onLoggedIn(player: Player) {
    this.localPlayer = player;
    this.wsService.connect(player);
  }

}
