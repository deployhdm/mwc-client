import { NgModule } from "@angular/core";
import { PasswordForgottenPage } from "./password-forgotten.page";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HomePageModule } from "../home/home.module";
import { PasswordForgottenRoutingModule } from "./password-forgotten-routing.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PasswordForgottenRoutingModule,
        HomePageModule
    ],
  declarations: [PasswordForgottenPage]
})
export class PasswordForgottenPageModule {}