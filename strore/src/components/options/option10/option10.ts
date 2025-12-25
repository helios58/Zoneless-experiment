import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppStore } from '../../../stores/app.store';

@Component({
  selector: 'app-option10',
  standalone: true,
  templateUrl: './option10.html',
  styleUrl: './option10.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option10 {
  private readonly store = inject(AppStore);
  private readonly optionIndex = 9;

  readonly isActive = computed(() => {
    const boxIndex = this.store.activeBoxIndex();
    if (boxIndex === null) return false;
    
    const selection = this.store.selections()[boxIndex];
    return selection ? selection.optionIndex === this.optionIndex : false;
  });

  onClick() {
  const boxIndex = this.store.activeBoxIndex();
  if (boxIndex === null) return;

  this.store.setActiveOption(this.optionIndex);
  this.store.saveSelection(boxIndex, this.optionIndex);

  this.store.activateNextBox();
  this.store.setActiveOption(null);
}

}
