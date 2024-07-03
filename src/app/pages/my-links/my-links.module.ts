import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLinksPageRoutingModule } from './my-links-routing.module';

import { MyLinksPage } from './my-links.page';
import {HomePageModule} from "../home/home.module";
import {HomeWithConnectionPageModule} from "../home/home-with-connection/home-with-connection.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLinksPageRoutingModule,
    HomePageModule,
    HomeWithConnectionPageModule
  ],
  declarations: [MyLinksPage]
})
export class MyLinksPageModule {}
