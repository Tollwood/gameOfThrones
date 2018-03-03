import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChatComponent} from './chat/chat.component';
import {LoginComponent} from './login/login.component';
import {GameOverviewComponent} from './game-overview/game-overview.component';
import {FormsModule} from '@angular/forms';
import {GotGameComponent} from './got-game/got-game.component';
import {AppRoutingModule} from './app.routing.module';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {LobbyComponent} from './lobby/lobby.component';
import {OverviewMenuComponent} from './got-game/overviewMenu/overview-menu.component';
import {BoardComponent} from './got-game/board/board.component';


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
