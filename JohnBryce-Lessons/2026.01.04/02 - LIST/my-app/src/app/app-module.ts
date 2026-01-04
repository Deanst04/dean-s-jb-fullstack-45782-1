import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './components/app/app';
import { List } from './components/list/list';
import { Home } from './components/home/home';
import { Profile } from './components/profile/profile';
import { Products } from './components/products/products';
import { Fruits } from './components/products/fruits/fruits';
import { Vegetables } from './components/products/vegetables/vegetables';
import { Meat } from './components/products/meat/meat';
import { Dairy } from './components/products/dairy/dairy';

@NgModule({
  declarations: [
    App,
    List,
    Home,
    Profile,
    Products,
    Fruits,
    Vegetables,
    Meat,
    Dairy
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
