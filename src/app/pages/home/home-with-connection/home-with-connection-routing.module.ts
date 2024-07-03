import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeWithConnectionPage } from './home-with-connection.page';

const routes: Routes = [
  {
    path: '',
    component: HomeWithConnectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeWithConnectionPageRoutingModule {}
