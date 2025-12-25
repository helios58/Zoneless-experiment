import { Injectable, signal } from '@angular/core';
import { BoxSelection, AllBoxesSelections } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  // Key for local storage
  private readonly SELECTIONS_KEY = 'boxesSelections';
  // Reactive signal to store selections
  private readonly _selections = signal<AllBoxesSelections>(
    this.loadSelections()
  );
  // Readonly signal for external access
  readonly selections = this._selections.asReadonly();

  constructor() {}
  // Save selection for a specific box
  saveSelection(boxIndex: number, optionIndex: number): boolean {
    if (!this.isValidIndex(boxIndex) || !this.isValidIndex(optionIndex)) {
      return false;
    }

    const updated: AllBoxesSelections = {
      ...this._selections(),
      [boxIndex]: { boxIndex, optionIndex }
    };

    this._selections.set(updated);
    return this.persist(updated);
  }
  // Get selection for a specific box
  getSelection(boxIndex: number): BoxSelection | null {
    return this.selections()[boxIndex] ?? null;
  }
  // Get all selections
  getAllSelections(): AllBoxesSelections {
    return this.selections();
  }
  // Clear all selections
  clearAllSelections(): void {
    this._selections.set({});
    localStorage.removeItem(this.SELECTIONS_KEY);
  }
  // Load selections from local storage
  private loadSelections(): AllBoxesSelections {
    try {
      const raw = localStorage.getItem(this.SELECTIONS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  // Persist selections to local storage
  private persist(value: AllBoxesSelections): boolean {
    try {
      localStorage.setItem(this.SELECTIONS_KEY, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  // Validate index
  private isValidIndex(index: number): boolean {
    return index >= 0 && index <= 9;
  }
}
