import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
  standalone: false
})
export class ActionCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() iconName!: string;
  @Input() iconBgClass: string = 'bg-gray-100';
  @Input() iconTextClass: string = 'text-gray-600';
  @Input() link!: string;

  constructor() {}
}
