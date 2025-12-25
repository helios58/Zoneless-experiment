import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { boxes } from '../boxes';
import { TotalValue } from '../total-value/total-value';

@Component({
  selector: 'app-boxes-container',
  standalone: true,
  imports: [...boxes, TotalValue],
  templateUrl: './boxes-container.html',
  styleUrls: ['./boxes-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesContainer {}
