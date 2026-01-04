import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-option',
  imports: [],
  templateUrl: './option.html',
  styleUrl: './option.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Option {
  // Accept option index as input (0-9)
  readonly optionIndex = input.required<number>();

  // Get the image source based on the option index
  readonly imageSrc = computed(() => `assets/images/option${this.optionIndex() + 1}.svg`);
  readonly imageAlt = computed(() => `option${this.optionIndex() + 1}`);
}

