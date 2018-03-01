import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Player} from '../../../../server/model/player';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Output() onLoggedIn = new EventEmitter<Player>();

  player: Player;

  constructor() {
  }

  ngOnInit() {
    this.player = new Player('', '');
  }

  login() {
    if (this.player.name.length > 0) {
      this.onLoggedIn.emit(this.player);
    }
  }
}
