import { Injectable } from '@angular/core';
import { AllBoxesSelections, BoxSelection } from '../interfaces';
import { isValidIndex } from '../utils/index-validator.util';

// Key for localStorage
const SELECTIONS_KEY = 'boxesSelections';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  // Load selections from localStorage with validation
  loadSelections(): AllBoxesSelections {
    try {
      const raw = localStorage.getItem(SELECTIONS_KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw);

      // Validate the structure of loaded data
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn('Invalid selections data structure');
        return {};
      }

      // Validate each selection entry
      const validated: AllBoxesSelections = {};
      for (const [key, value] of Object.entries(parsed)) {
        const boxIndex = Number.parseInt(key, 10);
        if (
          typeof value === 'object' &&
          value !== null &&
          typeof (value as any).optionIndex === 'number' &&
          isValidIndex(boxIndex) &&
          isValidIndex((value as any).optionIndex)
        ) {
          validated[boxIndex] = value as BoxSelection;
        }
      }

      return validated;
    } catch (error) {
      console.error('Error loading selections from localStorage:', error);
      return {};
    }
  }

  // Persist selections to localStorage
  persistSelections(selections: AllBoxesSelections): void {
    try {
      localStorage.setItem(SELECTIONS_KEY, JSON.stringify(selections));
    } catch (error) {
      console.error('Error persisting selections to localStorage:', error);
    }
  }

  // Clear all selections from localStorage
  clearSelections(): void {
    try {
      localStorage.removeItem(SELECTIONS_KEY);
    } catch (error) {
      console.error('Error clearing selections from localStorage:', error);
    }
  }
}

