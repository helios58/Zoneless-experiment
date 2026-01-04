import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllBoxesSelections, BoxSelection } from '../interfaces';
import { LocalStorageService } from './local-storage.service';
import { isValidIndex } from '../utils/index-validator.util';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private readonly _selections$ = new BehaviorSubject<AllBoxesSelections>(
    this.localStorageService.loadSelections()
  );

  // Public observable for components to subscribe to
  readonly selections$: Observable<AllBoxesSelections> = this._selections$.asObservable();

  constructor(private readonly localStorageService: LocalStorageService) {}

  // Get current selections value
  getSelections(): AllBoxesSelections {
    return this._selections$.value;
  }

  // Get a selection for a specific box
  getSelection(boxIndex: number): BoxSelection | null {
    return this._selections$.value[boxIndex] ?? null;
  }

  // Get the option index for a specific box
  getOptionIndex(boxIndex: number): number | null {
    const selection = this._selections$.value[boxIndex];
    return selection ? selection.optionIndex : null;
  }

  // Save a selection for a box
  saveSelection(boxIndex: number, optionIndex: number): void {
    if (!isValidIndex(boxIndex) || !isValidIndex(optionIndex)) return;

    const currentSelections = this._selections$.value;
    const updated: AllBoxesSelections = {
      ...currentSelections,
      [boxIndex]: { boxIndex, optionIndex },
    };

    this._selections$.next(updated);
    this.localStorageService.persistSelections(updated);
  }

  // Clear all selections
  clearAllSelections(): void {
    this._selections$.next({});
    this.localStorageService.clearSelections();
  }
}

