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
import {SettingsComponent} from './settings/settings.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {GameSettingsComponent} from './gameSettings/game-settings.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    SettingsComponent,
    // single Player
    GameSettingsComponent,
    GotGameComponent,
    OverviewMenuComponent,
    BoardComponent,
    // multiplayer
    LoginComponent,
    ChatComponent,
    GameOverviewComponent,
    LobbyComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
