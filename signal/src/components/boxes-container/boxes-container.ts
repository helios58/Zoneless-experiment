import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  DestroyRef,
  inject
} from '@angular/core';

import { ActiveBoxService } from '../../services/active-box.service';
import { ActiveOptionService } from '../../services/active-option.service';
import { LocalStorageService } from '../../services/local-storage.service';

import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Box } from '../box/box';
import { TotalValue } from '../total-value/total-value';
@Component({
  selector: 'app-boxes-container',
  imports: [Box, TotalValue],
  templateUrl: './boxes-container.html',
  styleUrls: ['./boxes-container.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesContainer implements AfterViewInit {
  //get references to all box elements
  @ViewChildren('boxRef', { read: ElementRef })
  boxElements!: QueryList<ElementRef<HTMLElement>>;
 
  //inject DestroyRef for cleanup
  private readonly destroyRef = inject(DestroyRef);

  // Array of box indices for the loop
  readonly boxIndices = Array.from({ length: 10 }, (_, i) => i);

  constructor(
    private readonly activeBoxService: ActiveBoxService,
    private readonly activeOptionService: ActiveOptionService,
    private readonly localStorageService: LocalStorageService
  ) { }


  ngAfterViewInit(): void {
    //set up click event listeners for each box
    this.boxElements.forEach((box, index) => {
      const selectableBox =
        box.nativeElement.querySelector('.selectable-box');

      if (!selectableBox) return;
      //listen for click events and handle box activation and option selection
      fromEvent(selectableBox, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          try {
            this.activeBoxService.activateByIndex(index);
            const saved = this.localStorageService.getSelection(index);
            if (saved) {
              this.activeOptionService.activateByIndex(saved.optionIndex);
            } else {
              this.activeOptionService.activateByIndex(null);
            }
          } catch (err) {
            console.error(err);
          }
        });
    });
  }
}

