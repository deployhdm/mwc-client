import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotesPageRoutingModule } from './notes-routing.module';
import { NotesPage } from './notes.page';
import {HomePageModule} from "../home/home.module";
import {HomeWithConnectionPageModule} from "../home/home-with-connection/home-with-connection.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    HomePageModule,
    HomeWithConnectionPageModule
  ],
  declarations: [NotesPage]
})
export class NotesPageModule {}
