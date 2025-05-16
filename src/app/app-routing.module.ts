import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/dashboard/profile/profile.component';
import { UsersComponent } from './features/dashboard/main/gestion/users/users.component';
import { AdminsComponent } from './features/dashboard/main/gestion/admins/admins.component';
import { RolesComponent } from './features/dashboard/main/gestion/roles/roles.component';
import { RoleGuard } from './core/guards/role.guard';
import { HomeContentComponent } from './features/dashboard/main/home-main/home-main.component';
import { ImagesComponent } from './features/dashboard/main/librairie/web/images/images.component';
import { VideosComponent } from './features/dashboard/main/librairie/web/videos/videos.component';
import { PictosComponent } from './features/dashboard/main/librairie/web/pictos/pictos.component';
import { DocumentsComponent } from './features/dashboard/main/librairie/web/documents/documents.component';
import { PlvComponent } from './features/dashboard/main/librairie/plv/plv.component';
import { MobileComponent } from './features/dashboard/main/librairie/mobile/mobile.component';
import { SocialMediaComponent } from './features/dashboard/main/librairie/social-media/social-media.component';
import { CampagnesComponent } from './features/dashboard/main/librairie/campagnes/campagnes.component';
import { PageNotFoundComponent } from './features/home/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes du dashboard
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeContentComponent }, // Route par défaut - accueil
      
      // Routes librairie/web
      { path: 'librairie/web/images', component: ImagesComponent, canActivate: [RoleGuard], data: { category: 'web', souscategory: 'images' } },
      { path: 'librairie/web/videos', component: VideosComponent, canActivate: [RoleGuard], data: { category: 'web', souscategory: 'videos' } },
      { path: 'librairie/web/pictos', component: PictosComponent, canActivate: [RoleGuard], data: { category: 'web', souscategory: 'pictogrammes' } },
      { path: 'librairie/web/documents', component: DocumentsComponent, canActivate: [RoleGuard], data: { category: 'web', souscategory: 'documents' } },
      
      // Autres routes librairie
      { path: 'librairie/plv', component: PlvComponent, canActivate: [RoleGuard], data: { category: 'PLV' } },
      { path: 'librairie/mobile', component: MobileComponent, canActivate: [RoleGuard], data: { category: 'Mobile' } },
      { path: 'librairie/sm', component: SocialMediaComponent, canActivate: [RoleGuard], data: { category: 'SM' } },
      { path: 'librairie/campagnes', component: CampagnesComponent, canActivate: [RoleGuard], data: { category: 'Campagnes' } },
      
      // Routes gestion
      { path: 'gestion/administrateurs', component: AdminsComponent, canActivate: [RoleGuard], data: { category: 'Administrateurs', roles: ['ROLE_SUPER'] } },
      { path: 'gestion/utilisateurs', component: UsersComponent, canActivate: [RoleGuard], data: { category: 'Utilisateurs', roles: ['ROLE_ADMIN', 'ROLE_SUPER'] } },
      { path: 'gestion/roles', component: RolesComponent, canActivate: [RoleGuard], data: { category: 'Roles', roles: ['ROLE_ADMIN', 'ROLE_SUPER'] } },
      
      // Profile
      { path: 'profile', component: ProfileComponent },

      // Gestion des routes non trouvées à l'intérieur du dashboard
      { path: '**', redirectTo: '' }
    ]
  },

  // Redirection par défaut
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Gestion des routes non trouvées
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, // Précharge les modules en arrière-plan
    scrollPositionRestoration: 'enabled',  // Restaure la position de défilement lors de la navigation
    anchorScrolling: 'enabled'            // Active le défilement vers les ancres
    // La propriété relativeLinkResolution a été supprimée car elle n'est plus prise en charge
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }