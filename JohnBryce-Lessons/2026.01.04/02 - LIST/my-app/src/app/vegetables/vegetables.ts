import { Component } from '@angular/core';

@Component({
  selector: 'app-vegetables',
  standalone: false,
  templateUrl: './vegetables.html',
  styleUrl: './vegetables.scss',
})
export class Vegetables {
  vegetables: string[] = [
    'Carrot',
    'Broccoli',
    'Cucumber',
    'Tomato',
    'Onion',
    'Garlic',
    'Pepper',
    'Spinach',
    'Potato'
  ];
}
