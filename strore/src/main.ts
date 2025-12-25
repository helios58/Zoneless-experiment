import { Component, Signal, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BoxesContainer } from './components/boxes-container/boxes-container';
import { OptionsContainer } from './components/options-container/options-container';
import { AppStore } from './stores/app.store';
import { provideStore } from '@ngrx/store';

@Component({
  imports: [BoxesContainer, OptionsContainer],
  selector: 'app-root',
  templateUrl: './main.html',
  standalone: true
})
export class App {
  // inject AppStore using Angular inject() function
  private readonly store = inject(AppStore);

  // expose the computed signal
  readonly isBoxSelected: Signal<boolean> = this.store.isBoxSelected;
}

bootstrapApplication(App, {
  providers: [provideStore()]
});
