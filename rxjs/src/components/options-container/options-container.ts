import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Option } from '../option/option';
import { TOTAL_ITEMS } from '../../utils/constants.util';

@Component({
  selector: 'app-options-container',
  imports: [Option],
  templateUrl: './options-container.html',
  styleUrl: './options-container.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsContainer {
  readonly optionIndexes = Array.from({ length: TOTAL_ITEMS }, (_, i) => i);
}
