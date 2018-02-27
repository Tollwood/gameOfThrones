import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {GotGameComponent} from './got-game/got-game.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {GameOverviewComponent} from './game-overview/game-overview.component';
import {LobbyComponent} from './lobby/lobby.component';

const routes: Routes = [
  {path: '', component: MainMenuComponent, pathMatch: 'full'},
  {path: 'local', component: GotGameComponent, pathMatch: 'full'},
  {path: 'lobby', component: LobbyComponent, pathMatch: 'full'},
  {path: 'overview', component: GameOverviewComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
