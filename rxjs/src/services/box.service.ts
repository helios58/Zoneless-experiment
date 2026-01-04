  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { isValidIndex } from '../utils/index-validator.util';
  import { OPTIONS_VALUE_MAP } from '../data/options-value';

  type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

  @Injectable({
    providedIn: 'root',
  })
  export class BoxService {
    private readonly _activeBoxIndex$ = new BehaviorSubject<number | null>(null);

    // Public observable for components to subscribe to
    readonly activeBoxIndex$: Observable<number | null> = this._activeBoxIndex$.asObservable();


    // Set the active box index
    setActiveBox(index: number | null): void {
      if (index !== null && !isValidIndex(index)) return;
      this._activeBoxIndex$.next(index);
    }

    // Activate the next box
    activateNextBox(): void {
      const current = this._activeBoxIndex$.value ?? -1;
      const next = current + 1;
      if (!isValidIndex(next)) return;
      this._activeBoxIndex$.next(next);
    }

    // Get current active box index value
    getActiveBoxIndex(): number | null {
      return this._activeBoxIndex$.value;
    }

   getOptionValueFromIndex(index: OptionIndex | null): number | null {
    if (index === null) return null;
    return OPTIONS_VALUE_MAP[index] ?? null;
  }
  }

