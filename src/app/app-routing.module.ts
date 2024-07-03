import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'inscription',
    loadChildren: () => import('./pages/inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'connexion',
    loadChildren: () => import('./pages/connexion/connexion.module').then( m => m.ConnexionPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/password-forgotten/password-forgotten.module').then( m => m.PasswordForgottenPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule)
  },
  {
    path: 'notes/:id',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule),
    data: { permissionLevel: 'READ' }
  },
  {
    path: 'links-group/:id',
    loadChildren: () => import('./pages/links-group/links-group.module').then( m => m.LinksGroupPageModule),
    data: { permissionLevel: 'READ' }
  },
  {
    path: 'my-links',
    loadChildren: () => import('./pages/my-links/my-links.module').then( m => m.MyLinksPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found-routing.module').then( m => m.NotFoundPageRoutingModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      useHash: true, 
      preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
