import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { OPTIONS_VALUE_MAP } from '../../data/options-value';

type OptionIndex = keyof typeof OPTIONS_VALUE_MAP;

@Component({
  selector: 'app-box',
  standalone: true,
  templateUrl: './box.html',
  styleUrl: './box.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Box {
  // Accept box index as input
  readonly boxIndex = input.required<number>();

  //get the selected option index for this box
  readonly optionIndex = computed<OptionIndex | null>(() => {
    const selection = this.localStorageService.selections()[this.boxIndex()];
    return selection ? (selection.optionIndex as OptionIndex) : null;
  });
  
  //get the image source based on the selected option index
  readonly imageSrc = computed(() => {
    const id = this.optionIndex();
    return id === null
      ? null
      : `assets/images/option${id + 1}.svg`;
  });
  
  //get the option value based on the selected option index
  readonly optionValue = computed(() => {
    const id = this.optionIndex();
    return id === null ? null : OPTIONS_VALUE_MAP[id];
  });

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}
}

