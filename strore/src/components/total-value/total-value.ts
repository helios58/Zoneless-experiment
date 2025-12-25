import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { OPTIONS_VALUE_MAP } from '../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-total-value',
  standalone: true,
  templateUrl: './total-value.html',
  styleUrl: './total-value.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalValue {
  // inject the store
  private readonly store = inject(AppStore);

  // compute the total value of all selected options
  readonly total = computed(() => {
    const selections = this.store.selections();
    try {
      return Object.values(selections).reduce((sum, selection) => {
        if (!selection || typeof selection.optionIndex !== 'number') {
          return sum;
        }
        const index = selection.optionIndex as OptionIndex;
        if (!(index in OPTIONS_VALUE_MAP)) {
          return sum;
        }
        return sum + (OPTIONS_VALUE_MAP[index] ?? 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating total value:', error);
      return 0;
    }
  });

  // clear all selections
  clearAll() {
    this.store.clearAllSelections();
  }
}
