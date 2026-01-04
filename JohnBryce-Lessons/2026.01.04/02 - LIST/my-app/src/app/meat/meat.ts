import { Component } from '@angular/core';

@Component({
  selector: 'app-meat',
  standalone: false,
  templateUrl: './meat.html',
  styleUrl: './meat.scss',
})
export class Meat {
  meats: string[] = [
    'Beef',
    'Chicken',
    'Turkey',
    'Lamb',
    'Pork',
    'Sausages',
    'Bacon'
  ];
}
