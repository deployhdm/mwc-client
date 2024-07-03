import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeWithoutConnectionPage } from './home-without-connection.page';

const routes: Routes = [
  {
    path: '',
    component: HomeWithoutConnectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeWithoutConnectionPageRoutingModule {}
