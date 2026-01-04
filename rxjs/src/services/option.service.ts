import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isValidIndex } from '../utils/index-validator.util';

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  private readonly _activeOptionIndex$ = new BehaviorSubject<number | null>(null);

  // Public observable for components to subscribe to
  readonly activeOptionIndex$: Observable<number | null> = this._activeOptionIndex$.asObservable();

  // Set the active option index
  setActiveOption(index: number | null): void {
    if (index !== null && !isValidIndex(index)) return;
    this._activeOptionIndex$.next(index);
  }

  // Get current active option index value
  getActiveOptionIndex(): number | null {
    return this._activeOptionIndex$.value;
  }
}

