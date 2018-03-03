import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private languages: Map<string, string>;
  private selectedLanguage: string;
  private languageKeys: string[];

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.languages = new Map();
    this.languages.set('de', 'GERMAN');
    this.languages.set('en', 'ENGLISH');
    this.languageKeys = Array.from(this.languages.keys());
    this.selectedLanguage = this.translate.currentLang;
  }

  apply() {
    this.translate.use(this.selectedLanguage);
  }
}
