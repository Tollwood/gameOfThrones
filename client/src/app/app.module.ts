import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChatComponent} from './chat/chat.component';
import {LoginComponent} from './login/login.component';
import {GameOverviewComponent} from './game-overview/game-overview.component';
import {FormsModule} from '@angular/forms';
import {GameComponent} from './game/game.component';
import {GotGameComponent} from './got-game/got-game.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    GameOverviewComponent,
    GameComponent,
    GotGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
