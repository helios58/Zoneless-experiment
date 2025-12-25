import { ChangeDetectionStrategy, Component } from '@angular/core';
import { options } from '../options';

@Component({
  selector: 'app-options-container',
  imports: [options],
  templateUrl: './options-container.html',
  styleUrl: './options-container.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsContainer {}
