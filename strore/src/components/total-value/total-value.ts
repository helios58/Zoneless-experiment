import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-total-value',
  standalone: true,
  templateUrl: './total-value.html',
  styleUrl: './total-value.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalValue {
  // inject the store
  readonly store = inject(AppStore);

  // get total from store
  readonly total = this.store.total;

  // clear all selections
  clearAll() {
    this.store.clearAllSelections();
  }
}
