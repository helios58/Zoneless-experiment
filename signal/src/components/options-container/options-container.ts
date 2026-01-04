import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChildren, QueryList, inject, DestroyRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActiveOptionService } from '../../services/active-option.service';
import { ActiveBoxService } from '../../services/active-box.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Option } from '../option/option';
@Component({
  selector: 'app-options-container',
  imports: [Option],
  templateUrl: './options-container.html',
  styleUrl: './options-container.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsContainer implements AfterViewInit {
  //get references to all option elements
  @ViewChildren('optionRef', { read: ElementRef }) optionElements!: QueryList<ElementRef<HTMLElement>>;
  //inject DestroyRef for cleanup
  private readonly destroyRef = inject(DestroyRef);

  // Array of option indices for the loop
  readonly optionIndices = Array.from({ length: 10 }, (_, i) => i);

  constructor(
    private readonly activeOptionService: ActiveOptionService,
    private readonly activeBoxService: ActiveBoxService,
    private readonly localStorageService: LocalStorageService
  ) {}

  ngAfterViewInit() {
    //set up click event listeners for each option
    this.optionElements.forEach((option, index) => {
      const selectableOption = option.nativeElement.querySelector('.selectable-option');
      if (!selectableOption) return;
      //  listen for click events and handle option selection
      fromEvent(selectableOption, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          try {
            // activate the clicked option
            this.activeOptionService.activateByIndex(index);

            // get the currently active box index
            const boxIndex = this.activeBoxService.getActiveIndex();
            if (boxIndex === null) return;

            // save the selection to local storage
            const saved = this.localStorageService.saveSelection(boxIndex, index);
            if (saved) {
              // move to the next box if the selection was saved successfully
              const moved = this.activeBoxService.activateNext();
              // if moved to the next box, reset the active option
              if (moved) {
                this.activeOptionService.activateByIndex(null);
              }
            }
          } catch (err) {
            console.error(err);
          }
        });
    });
  }
}
