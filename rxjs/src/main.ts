import { Component, Signal, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BoxesContainer } from './components/boxes-container/boxes-container';
import { OptionsContainer } from './components/options-container/options-container';
import { BoxService } from './services/box.service';

@Component({
  imports: [BoxesContainer, OptionsContainer],
  selector: 'app-root',
  templateUrl: './main.html',
  standalone: true
})
export class App {
  // inject BoxService using Angular inject() function
  private readonly boxService = inject(BoxService);

  // expose the computed signal
  readonly isBoxSelected: Signal<boolean> = toSignal(
    this.boxService.activeBoxIndex$.pipe(map((index) => index !== null)),
    { initialValue: false }
  );
}

bootstrapApplication(App);
