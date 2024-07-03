import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: '',
      component: NotFoundComponent,
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class NotFoundPageRoutingModule {}