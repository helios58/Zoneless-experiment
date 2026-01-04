import { MAX_INDEX } from './constants.util';

// Validates that an index is within the valid range
export function isValidIndex(index: number): boolean {
  return index >= 0 && index <= MAX_INDEX;
}

