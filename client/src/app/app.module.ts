import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChatComponent} from './multiplayer/chat/chat.component';
import {LoginComponent} from './multiplayer/login/login.component';
import {GameOverviewComponent} from './multiplayer/game-overview/game-overview.component';
import {FormsModule} from '@angular/forms';
import {GotGameComponent} from './game/game.component';
import {AppRoutingModule} from './app.routing.module';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {LobbyComponent} from './multiplayer/lobby/lobby.component';
import {OverviewMenuComponent} from './game/overviewMenu/overview-menu.component';
import {BoardComponent} from './game/board/board.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    GameOverviewComponent,
    MainMenuComponent,
    LobbyComponent,
    GotGameComponent,
    OverviewMenuComponent,
    BoardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
