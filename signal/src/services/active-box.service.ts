import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActiveBoxService {
  // Store active box index or null if none
  activeBoxIndex: WritableSignal<number | null> = signal<number | null>(null);

  // Computed signal to indicate if there is an active box
  hasActive: Signal<boolean> = computed(() => this.activeBoxIndex() !== null);

  // Cache for box elements
  private boxes: HTMLElement[] | null = null;

  // Getter for active box index
  getActiveIndex(): number | null {
    return this.activeBoxIndex();
  }

  // Clear selection
  clear(): void {
    this.activeBoxIndex.set(null);
  }

  // Get boxes
  private getBoxes(): HTMLElement[] {
    if (typeof document === 'undefined') {
      this.boxes = [];
      return this.boxes;
    }

    this.boxes ??= Array.from(
      document.querySelectorAll<HTMLElement>('.selectable-box')
    );

    return this.boxes;
  }


  // Activate a box by index 
  activateByIndex(index: number | null): boolean {
    const boxes = this.getBoxes();

    // Clear active
    if (index === null) {
      const prev = this.activeBoxIndex();
      if (prev !== null && boxes[prev]) {
        boxes[prev].classList.remove('active');
      }
      this.clear();
      return false;
    }

    if (index < 0 || index >= boxes.length) {
      return false;
    }

    // Remove previous active
    const prev = this.activeBoxIndex();
    if (prev !== null && boxes[prev]) {
      boxes[prev].classList.remove('active');
    }

    // Activate new box
    const box = boxes[index];
    box.classList.add('active');
    this.activeBoxIndex.set(index);

    return true;
  }

  // Activate next box (if any). Returns true if moved to next box.
  activateNext(): boolean {
    const current = this.getActiveIndex();
    const next = (current ?? 0) + 1;
    return this.activateByIndex(next);
  }
}