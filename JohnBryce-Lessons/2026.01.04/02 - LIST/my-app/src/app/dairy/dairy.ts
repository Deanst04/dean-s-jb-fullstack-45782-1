import { Component } from '@angular/core';

@Component({
  selector: 'app-dairy',
  standalone: false,
  templateUrl: './dairy.html',
  styleUrl: './dairy.scss',
})
export class Dairy {
  dairy: string[] = [
    'Milk',
    'Cheese',
    'Yogurt',
    'Butter',
    'Cream',
    'Cottage Cheese',
    'Ice Cream'
  ];
}
