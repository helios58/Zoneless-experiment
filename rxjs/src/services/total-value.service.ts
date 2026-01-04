import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SelectionService } from './selection.service';
import { OPTIONS_VALUE_MAP } from '../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Injectable({
  providedIn: 'root',
})
export class TotalValueService {
  // Computed observable for total value
  readonly total$: Observable<number> = this.selectionService.selections$.pipe(
    map((selections) => {
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
    })
  );

  constructor(private readonly selectionService: SelectionService) {}
}

