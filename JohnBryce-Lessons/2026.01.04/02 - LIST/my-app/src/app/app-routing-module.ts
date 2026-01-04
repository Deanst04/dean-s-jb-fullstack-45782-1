import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { List } from './list/list';
import { Profile } from './profile/profile';
import { Products } from './products/products';
import { Fruits } from './fruits/fruits';
import { Vegetables } from './vegetables/vegetables';
import { Meat } from './meat/meat';
import { Dairy } from './dairy/dairy';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'list', component: List },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'products', component: Products, 
    children: [
      { path: 'fruits', component: Fruits },
      { path: 'vegetables', component: Vegetables },
      { path: 'meat', component: Meat },
      { path: 'dairy', component: Dairy },
      { path: '', redirectTo: 'fruits', pathMatch: 'full' }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}