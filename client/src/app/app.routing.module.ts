import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {GotGameComponent} from './game/game.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {GameOverviewComponent} from './multiplayer/game-overview/game-overview.component';
import {LobbyComponent} from './multiplayer/lobby/lobby.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: '', component: MainMenuComponent, pathMatch: 'full'},
  {path: 'game-settings', component: SettingsComponent, pathMatch: 'full'},
  {path: 'game/:id', component: GotGameComponent, pathMatch: 'full'},
  {path: 'lobby', component: LobbyComponent, pathMatch: 'full'},
  {path: 'settings', component: SettingsComponent, pathMatch: 'full'},
  {path: 'overview', component: GameOverviewComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
