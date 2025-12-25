import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActiveOptionService {
  // signal holding the index of the current active option
  activeOptionIndex: WritableSignal<number | null> = signal<number | null>(null);

  // computed signal that returns true when an option is selected
  hasActive: Signal<boolean> = computed(() => this.activeOptionIndex() !== null);

  // list for option elements
  private options: HTMLElement[] | null = null;

  // Get options
  private getOptions(): HTMLElement[] {
    if (typeof document === 'undefined') {
      this.options = [];
      return this.options;
    }

    this.options ??= Array.from(
      document.querySelectorAll<HTMLElement>('.selectable-option')
    );

    return this.options;
  }


  // Activation helper: toggle DOM active class and update signal
  activateByIndex(index: number | null): boolean {
    const optionsEls = this.getOptions();
    optionsEls.forEach(el => el.classList.remove('active'));
    
    if (index === null) {
      return false;
    }

    if (index < 0 || index >= optionsEls.length) {
      return false;
    }

    const el = optionsEls[index];
    if (el) {
      el.classList.add('active');
      this.activeOptionIndex.set(index);
      return true;
    }

    return false;
  }

  // getter for active option index
  getActiveIndex(): number | null {
    return this.activeOptionIndex();
  }

  // clear selection
  clear(): void {
    this.activeOptionIndex.set(null);
  }
}