import {
  ChangeDetectionStrategy,
  Component,
  computed
} from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { OPTIONS_VALUE_MAP } from '../../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-box7',
  standalone: true,
  templateUrl: './box7.html',
  styleUrl: './box7.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Box7 {
  private readonly boxIndex = 6;

  readonly optionIndex = computed<OptionIndex | null>(() => {
    const selection = this.localStorageService.selections()[this.boxIndex];
    return selection ? (selection.optionIndex as OptionIndex) : null;
  });

  readonly imageSrc = computed(() => {
    const id = this.optionIndex();
    return id === null
      ? null
      : `assets/images/option${id + 1}.svg`;
  });

  readonly optionValue = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : OPTIONS_VALUE_MAP[id];
  });

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}
}
