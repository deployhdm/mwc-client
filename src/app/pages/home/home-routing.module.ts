import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {IsConnectedResolver} from "../../resolver/isConnectedResolver";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: {
      isConnectedResolver : IsConnectedResolver
    }
  },
  {
    path: 'home-without-connection',
    loadChildren: () => import('./home-without-connection/home-without-connection.module').then( m => m.HomeWithoutConnectionPageModule)
  },
  {
    path: 'home-with-connection',
    loadChildren: () => import('./home-with-connection/home-with-connection.module').then( m => m.HomeWithConnectionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
