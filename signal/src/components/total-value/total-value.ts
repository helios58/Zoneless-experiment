import {
  ChangeDetectionStrategy,
  Component,
  computed
} from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { OPTIONS_VALUE_MAP } from '../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;
@Component({
  selector: 'app-total-value',
  imports: [],
  templateUrl: './total-value.html',
  styleUrl: './total-value.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalValue {

  //compute the total value of all selected options
  readonly total = computed(() => {
    const selections = this.localStorageService.selections();

    return Object.values(selections).reduce((sum, selection) => {
      const index = selection.optionIndex as OptionIndex;
      return sum + OPTIONS_VALUE_MAP[index];
    }, 0);
  });

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}

  // clear all selections
  clearAll() {
    this.localStorageService.clearAllSelections();
  }
}
