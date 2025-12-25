import { ChangeDetectionStrategy, Component, computed, inject, DestroyRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppStore } from '../../../stores/app.store';

@Component({
  selector: 'app-option7',
  standalone: true,
  templateUrl: './option7.html',
  styleUrl: './option7.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option7 {
  private readonly store = inject(AppStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly clickSubject = new Subject<void>();

  private readonly optionIndex = 6;

  readonly isActive = computed(() => {
    const boxIndex = this.store.activeBoxIndex();
    if (boxIndex === null) return false;
    const selection = this.store.selections()[boxIndex];
    return selection ? selection.optionIndex === this.optionIndex : false;
  });

  constructor() {
    this.clickSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const boxIndex = this.store.activeBoxIndex();
        if (boxIndex === null) return;

        this.store.setActiveOption(this.optionIndex);
        this.store.saveSelection(boxIndex, this.optionIndex);

        this.store.activateNextBox();

        this.store.setActiveOption(null);
      });
  }

  onClick(): void {
    this.clickSubject.next();
  }
}
