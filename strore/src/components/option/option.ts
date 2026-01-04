import { ChangeDetectionStrategy, Component, computed, inject, DestroyRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-option',
  standalone: true,
  templateUrl: './option.html',
  styleUrl: './option.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option {
  @Input({ required: true }) optionIndex!: number;

  // inject the AppStore and DestroyRef
  private readonly store = inject(AppStore);
  private readonly destroyRef = inject(DestroyRef);

  // Subject to emit click events
  private readonly clickSubject = new Subject<void>();

  // computed property to check if this option is active
  readonly isActive = computed(() => {
    const boxIndex = this.store.activeBoxIndex();
    if (boxIndex === null) return false;
    const selection = this.store.selections()[boxIndex];
    return selection ? selection.optionIndex === this.optionIndex : false;
  });

  // computed property for image source
  readonly imageSrc = computed(() => `assets/images/option${this.optionIndex + 1}.svg`);

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

