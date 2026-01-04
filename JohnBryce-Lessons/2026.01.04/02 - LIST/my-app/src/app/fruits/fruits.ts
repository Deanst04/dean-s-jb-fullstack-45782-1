import { Component } from '@angular/core';

@Component({
  selector: 'app-fruits',
  standalone: false,
  templateUrl: './fruits.html',
  styleUrl: './fruits.scss',
})
export class Fruits {
  fruits: string[] = [
    'Apple',
    'Banana',
    'Orange',
    'Strawberry',
    'Mango',
    'Pineapple',
    'Grapes',
    'Watermelon',
    'Blueberries'
  ];
}
