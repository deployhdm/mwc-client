import { RouterModule, Routes } from "@angular/router";
import { PasswordForgottenPage } from "./password-forgotten.page";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: ':token',
    component: PasswordForgottenPage,
  },
  {
    path: '',
    component: PasswordForgottenPage,
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordForgottenRoutingModule {}