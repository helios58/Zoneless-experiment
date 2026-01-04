import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TotalValueService } from '../../services/total-value.service';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-total-value',
  standalone: true,
  templateUrl: './total-value.html',
  styleUrl: './total-value.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalValue {
  // inject services
  private readonly totalValueService = inject(TotalValueService);
  private readonly selectionService = inject(SelectionService);

  // get total from service as signal
  readonly total = toSignal(this.totalValueService.total$, { initialValue: 0 });

  // clear all selections
  clearAll() {
    this.selectionService.clearAllSelections();
  }
}
