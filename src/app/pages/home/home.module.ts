import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {HomeWithoutConnectionPageModule} from "./home-without-connection/home-without-connection.module";
import {HomeWithConnectionPageModule} from "./home-with-connection/home-with-connection.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HomeWithoutConnectionPageModule,
    HomeWithConnectionPageModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
    declarations: [HomePage, HeaderComponent, FooterComponent, NavbarComponent]
})
export class HomePageModule {}
