import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List {
  fruits: string[] = [
    'Apple',
    'Banana',
    'Orange',
    'Strawberry',
    'Mango',
    'Pineapple',
    'Grapes'
  ];
  isLoggedIn: boolean = false;
  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
  counter: number = 0
  increaseCounter() {
    this.counter++
  }
}
