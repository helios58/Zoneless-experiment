import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from "@ngrx/signals";
import { InjectionToken, inject, computed } from "@angular/core";
import { BoxSelection, AllBoxesSelections } from "../interfaces";
import { OPTIONS_VALUE_MAP } from "../data/options-value";

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

// Define the shape of the application state
export type AppState = {
  activeBoxIndex: number | null;
  activeOptionIndex: number | null;
  selections: AllBoxesSelections;
};

// Key for localStorage
const SELECTIONS_KEY = "boxesSelections";
// Injection token for the initial state
export const APP_STATE_TOKEN = new InjectionToken<AppState>(
  "APP_STATE_TOKEN",
  {
    factory: () => ({
      activeBoxIndex: null,
      activeOptionIndex: null,
      selections: loadSelections(),
    }),
  },
);
// Create the AppStore using signalStore
export const AppStore = signalStore(
  {
    providedIn: "root",
  },
  // Initialize state from the injection token
  withState<AppState>(() => inject(APP_STATE_TOKEN)),
  // Define methods to manipulate the state
  withMethods((store) => ({
    // method to set the active box index
    setActiveBox(index: number | null) {
      if (index !== null && !isValidIndex(index)) return;

      patchState(store, {
        activeBoxIndex: index,
      });
    },
    // method to activate the next box
    activateNextBox() {
      const next = (store.activeBoxIndex() ?? -1) + 1;

      if (!isValidIndex(next)) return;

      patchState(store, {
        activeBoxIndex: next,
      });
    },
    // method to set the active option index
    setActiveOption(index: number | null) {
      if (index !== null && !isValidIndex(index)) return;

      patchState(store, {
        activeOptionIndex: index,
      });
    },
    // method to save a selection for a box
    saveSelection(boxIndex: number, optionIndex: number) {
      if (!isValidIndex(boxIndex) || !isValidIndex(optionIndex)) return;

      const updated: AllBoxesSelections = {
        ...store.selections(),
        [boxIndex]: { boxIndex, optionIndex },
      };

      patchState(store, {
        selections: updated,
      });

      persist(updated);
    },
    // method to clear all selections
    clearAllSelections() {
      patchState(store, {
        selections: {},
      });

      localStorage.removeItem(SELECTIONS_KEY);
    },
   // method to get a selection for a box
    getSelection(boxIndex: number): BoxSelection | null {
      return store.selections()[boxIndex] ?? null;
    },
    // method to get the option index for a box
    getOptionIndex(boxIndex: number): number | null {
      const selection = store.selections()[boxIndex];
      return selection ? selection.optionIndex : null;
    },
  })),
  // Define computed properties
  withComputed((store) => ({
    isBoxSelected: computed(() => store.activeBoxIndex() !== null),
    isOptionSelected: computed(() => store.activeOptionIndex() !== null),
    // compute the total value of all selected options
    total: computed(() => {
      const selections = store.selections();
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
    }),
  })),
);
// Helper function to validate box and option indices
function isValidIndex(index: number): boolean {
  return index >= 0 && index <= 9;
}
// Helper function to load selections from localStorage with validation
function loadSelections(): AllBoxesSelections {
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
      if (typeof value === 'object' && value !== null && 
          typeof (value as any).optionIndex === 'number' &&
          isValidIndex(boxIndex) && isValidIndex((value as any).optionIndex)) {
        validated[boxIndex] = value as BoxSelection;
      }
    }
    
    return validated;
  } catch (error) {
    console.error('Error loading selections from localStorage:', error);
    return {};
  }
}
// Helper function to persist selections to localStorage
function persist(selections: AllBoxesSelections): void {
  try {
    localStorage.setItem(SELECTIONS_KEY, JSON.stringify(selections));
  } catch {}
}
