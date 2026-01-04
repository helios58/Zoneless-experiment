import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { BoxService } from '../../services/box.service';
import { SelectionService } from '../../services/selection.service';
import { OptionService } from '../../services/option.service';
import { OPTIONS_VALUE_MAP } from '../../data/options-value';

export type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-box',
  standalone: true,
  templateUrl: './box.html',
  styleUrl: './box.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Box implements OnInit, OnDestroy {
  @Input({ required: true }) boxIndex!: number;

  // injections
  private readonly boxService = inject(BoxService);
  private readonly selectionService = inject(SelectionService);
  private readonly optionService = inject(OptionService);
  private readonly destroyRef = inject(DestroyRef);

  // click stream
  private readonly clickSubject = new Subject<void>();

  // active state
  readonly isActive = toSignal(
    this.boxService.activeBoxIndex$.pipe(
      map(index => index === this.boxIndex)
    ),
    { initialValue: false }
  );

  // source of truth
  readonly optionIndex = signal<OptionIndex | null>(null);

  // derived image
  readonly imageSrc = computed(() => {
    const index = this.optionIndex();
    return index !== null
      ? `assets/images/option${Number(index) + 1}.svg`
      : null;
  });

  // derived value
  readonly optionValue = computed(() =>
    this.boxService.getOptionValueFromIndex(this.optionIndex())
  );

  ngOnInit(): void {
    // restore persisted selection
    this.syncFromSelection();

    // handle clicks
    this.clickSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleClick());

    // react to selection changes
    this.selectionService.selections$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncFromSelection());
  }

  // template hook
  onClick(): void {
    this.clickSubject.next();
  }

  ngOnDestroy(): void {
    this.clickSubject.complete();
  }

  // handle the click event
  private handleClick(): void {
    this.boxService.setActiveBox(this.boxIndex);

    const saved = this.selectionService.getSelection(this.boxIndex);
    const index = saved ? (saved.optionIndex as OptionIndex) : null;

    this.optionIndex.set(index);
    this.optionService.setActiveOption(index);
  }

  private syncFromSelection(): void {
    const saved = this.selectionService.getSelection(this.boxIndex);
    this.optionIndex.set(
      saved ? (saved.optionIndex as OptionIndex) : null
    );
  }
}
