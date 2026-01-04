import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { BoxService } from '../../services/box.service';
import { SelectionService } from '../../services/selection.service';
import { OptionService } from '../../services/option.service';

@Component({
  selector: 'app-option',
  standalone: true,
  templateUrl: './option.html',
  styleUrl: './option.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option implements OnInit, OnDestroy {
  @Input({ required: true }) optionIndex!: number;

  // injections 
  private readonly boxService = inject(BoxService);
  private readonly selectionService = inject(SelectionService);
  private readonly optionService = inject(OptionService);
  private readonly destroyRef = inject(DestroyRef);

  // click stream
  private readonly clickSubject = new Subject<void>();

  // is this option active?
  readonly isActive = toSignal(
    combineLatest([
      this.boxService.activeBoxIndex$,
      this.selectionService.selections$,
    ]).pipe(
      map(([boxIndex, selections]) => {
        if (boxIndex === null) return false;
        const selection = selections[boxIndex];
        return selection?.optionIndex === this.optionIndex;
      })
    ),
    { initialValue: false }
  );

  // image source
  get imageSrc(): string {
    return `assets/images/option${this.optionIndex + 1}.svg`;
  }

  ngOnInit(): void {
    this.clickSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleClick());
  }

  // template hook
  onClick(): void {
    this.clickSubject.next();
  }

  ngOnDestroy(): void {
    this.clickSubject.complete();
  }

  private handleClick(): void {
    const boxIndex = this.boxService.getActiveBoxIndex();
    if (boxIndex === null) return;

    // mark this option active
    this.optionService.setActiveOption(this.optionIndex);

    // save selection for active box
    this.selectionService.saveSelection(boxIndex, this.optionIndex);

    // move to next box
    this.boxService.activateNextBox();

    // clear active option
    this.optionService.setActiveOption(null);
  }
}
