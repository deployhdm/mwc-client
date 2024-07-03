import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilPage } from './profil.page';
import {IsConnectedResolver} from "../../resolver/isConnectedResolver";

const routes: Routes = [
  {
    path: '',
    component: ProfilPage,
    resolve: {
      isConnectedResolver: IsConnectedResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilPageRoutingModule {}
