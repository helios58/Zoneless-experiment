import { ChangeDetectionStrategy, Component, computed, inject, DestroyRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppStore } from '../../../stores/app.store';

@Component({
  selector: 'app-option1',
  standalone: true,
  templateUrl: './option1.html',
  styleUrl: './option1.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option1 {
  // inject the AppStore and DestroyRef
  private readonly store = inject(AppStore);
  private readonly destroyRef = inject(DestroyRef);

  // Subject to emit click events
  private readonly clickSubject = new Subject<void>();

  // option index set to 0 for Option1
  private readonly optionIndex = 0;

  // computed property to check if this option is active
  readonly isActive = computed(() => {
    const boxIndex = this.store.activeBoxIndex();
    if (boxIndex === null) return false;
    const selection = this.store.selections()[boxIndex];
    return selection ? selection.optionIndex === this.optionIndex : false;
  });

  constructor() {
    // subscribe to the click observable with automatic cleanup
    this.clickSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const boxIndex = this.store.activeBoxIndex();
        if (boxIndex === null) return;

        // set this option as active
        this.store.setActiveOption(this.optionIndex);

        // save the selection for the active box
        this.store.saveSelection(boxIndex, this.optionIndex);

        // activate the next box
        this.store.activateNextBox();

        // clear the active option
        this.store.setActiveOption(null);
      });
  }

  // called from template
  onClick(): void {
    this.clickSubject.next();
  }
}
