import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LinksGroupPage } from './links-group.page';
import {LinksGroupResolver} from "../../resolver/linksGroupResolver";
import {LinksResolver} from "../../resolver/linksResolver";
import {IsConnectedResolver} from "../../resolver/isConnectedResolver";

const routes: Routes = [
  {
    path: '',
    component: LinksGroupPage,
    resolve: {
      linksGroupResolver : LinksGroupResolver,
      linksResolver : LinksResolver,
      isConnectedResolver : IsConnectedResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinksGroupPageRoutingModule {}
