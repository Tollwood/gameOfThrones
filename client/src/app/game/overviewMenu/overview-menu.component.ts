import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player, State, StateSelectorService} from 'got-store/dist';

@Component({
  selector: 'app-overview-menu',
  templateUrl: './overview-menu.component.html',
  styleUrls: ['./overview-menu.component.scss']
})
export class OverviewMenuComponent implements OnInit {

  @Input()
  localPlayer: Player;
  @Input()
  localState: State;
  @Output()
  onCloseGame: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.updateTopMenu(this.localState);
  }

  getVictoryPosition(player: Player): number {
    return StateSelectorService.getVictoryPositionFor(this.localState, player.house);
  }


  private updateTopMenu(state: State) {
    this.localPlayer = state.players.find((player) => this.localPlayer.house === player.house);
  }

  closeGame() {
    this.onCloseGame.emit();
  }
}

