import { ChangeDetectionStrategy, Component, computed, inject, DestroyRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppStore } from '../../stores/app.store';
import { OPTIONS_VALUE_MAP } from '../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-box',
  standalone: true,
  templateUrl: './box.html',
  styleUrl: './box.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Box {
  @Input({ required: true }) boxIndex!: number;

  // inject the store and destroy ref
  private readonly store = inject(AppStore);
  private readonly destroyRef = inject(DestroyRef);

  // Subject to emit click events
  private readonly clickSubject = new Subject<void>();

  // computed properties
  readonly isActive = computed(() => this.store.activeBoxIndex() === this.boxIndex);

  // get the option index for this box
  readonly optionIndex = computed<OptionIndex | null>(() => {
    const activeOption = this.store.getOptionIndex(this.boxIndex);
    if (activeOption !== null) return activeOption as OptionIndex;

    const selection = this.store.selections()[this.boxIndex];
    return selection ? (selection.optionIndex as OptionIndex) : null;
  });
  
  // get the image source and option value based on the option index
  readonly imageSrc = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : `assets/images/option${id + 1}.svg`;
  });

  // get the option value based on the option index
  readonly optionValue = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : OPTIONS_VALUE_MAP[id];
  });

  constructor() {
    // subscribe to click events
    this.clickSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.store.setActiveBox(this.boxIndex);

        const saved = this.store.getSelection(this.boxIndex);
        this.store.setActiveOption(saved ? this.optionIndex() : null);
      });
  }

  // called from template
  onClick(): void {
    this.clickSubject.next();
  }
}

