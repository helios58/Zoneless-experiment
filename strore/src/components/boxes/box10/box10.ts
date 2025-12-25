import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { AppStore } from '../../../stores/app.store';
import { OPTIONS_VALUE_MAP } from '../../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-box10',
  standalone: true,
  templateUrl: './box10.html',
  styleUrl: './box10.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Box10 {
  private readonly boxIndex = 9;
  private readonly store = inject(AppStore);

  readonly isActive = computed(
    () => this.store.activeBoxIndex() === this.boxIndex
  );

  readonly optionIndex = computed<OptionIndex | null>(() => {
    const selection = this.store.selections()[this.boxIndex];
    return selection ? (selection.optionIndex as OptionIndex) : null;
  });

  readonly imageSrc = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : `assets/images/option${id + 1}.svg`;
  });

  readonly optionValue = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : OPTIONS_VALUE_MAP[id];
  });

  onClick(): void {
    this.store.setActiveBox(this.boxIndex);
    const saved = this.store.getSelection(this.boxIndex);
    this.store.setActiveOption(saved ? this.optionIndex() : null);
  }
}