import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LinksGroupPageRoutingModule } from './links-group-routing.module';

import { LinksGroupPage } from './links-group.page';
import {HomePageModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LinksGroupPageRoutingModule,
        HomePageModule
    ],
  declarations: [LinksGroupPage]
})
export class LinksGroupPageModule {}
