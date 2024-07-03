import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotesPage } from './notes.page';
import {IsConnectedResolver} from "../../resolver/isConnectedResolver";

const routes: Routes = [
  {
    path: '',
    component: NotesPage,
    resolve: {
      isConnectedResolver: IsConnectedResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesPageRoutingModule {}
