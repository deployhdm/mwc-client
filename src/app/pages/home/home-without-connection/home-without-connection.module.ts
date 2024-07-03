import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeWithoutConnectionPageRoutingModule } from './home-without-connection-routing.module';

import { HomeWithoutConnectionPage } from './home-without-connection.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomeWithoutConnectionPageRoutingModule
    ],
    exports: [
        HomeWithoutConnectionPage
    ],
    declarations: [HomeWithoutConnectionPage]
})
export class HomeWithoutConnectionPageModule {}
