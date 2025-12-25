import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-option1',
  imports: [],
  templateUrl: './option1.html',
  styleUrl: './option1.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Option1 {

}
