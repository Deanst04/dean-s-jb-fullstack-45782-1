import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { List } from './components/list/list';
import { Profile } from './components/profile/profile';
import { Products } from './components/products/products';
import { Fruits } from './components/products/fruits/fruits';
import { Vegetables } from './components/products/vegetables/vegetables';
import { Meat } from './components/products/meat/meat';
import { Dairy } from './components/products/dairy/dairy';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'list', component: List },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'products',
    component: Products,
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
