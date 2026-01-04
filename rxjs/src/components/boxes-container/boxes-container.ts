import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { TotalValue } from '../total-value/total-value';
import { Box } from '../box/box';
import { TOTAL_ITEMS } from '../../utils/constants.util';

@Component({
  selector: 'app-boxes-container',
  standalone: true,
  imports: [Box, TotalValue],
  templateUrl: './boxes-container.html',
  styleUrls: ['./boxes-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesContainer {
  readonly boxIndexes = Array.from({ length: TOTAL_ITEMS }, (_, i) => i);
}
