import { Component, Signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BoxesContainer } from './components/boxes-container/boxes-container';
import { OptionsContainer } from './components/options-container/options-container';
import { ActiveBoxService } from './services/active-box.service';
import { ActiveOptionService } from './services/active-option.service';

@Component({
  imports: [BoxesContainer, OptionsContainer],
  selector: 'app-root',
  templateUrl: './main.html',
})
export class App {
  isBoxSelected!: Signal<boolean>;

  constructor(
    public activeBoxService: ActiveBoxService,
    public activeOptionService: ActiveOptionService
  ) {
    // expose the computed `hasActive` signals from the services so templates
    // can react to changes automatically
    this.isBoxSelected = this.activeBoxService.hasActive;
    console.log('App initialized');
  }
}

bootstrapApplication(App);