import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { List } from './list/list';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { Products } from './products/products';
import { Fruits } from './fruits/fruits';
import { Vegetables } from './vegetables/vegetables';
import { Meat } from './meat/meat';
import { Dairy } from './dairy/dairy';

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
