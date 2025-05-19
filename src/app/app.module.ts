import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules de Angular Material nécessaires
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { HomeContentComponent } from './features/dashboard/main/home-main/home-main.component';
import { UsersComponent } from './features/dashboard/main/gestion/users/users.component';
import { DocumentsComponent } from './features/dashboard/main/librairie/web/documents/documents.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Nécessaire pour les animations de Angular Material
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, // Nécessaire pour les formulaires réactifs
    HttpClientModule,
    
    // Modules Angular Material
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    // Si vous utilisez des composants standalone, importez-les ici
    UsersComponent,
    HomeContentComponent,
    ResetPasswordComponent,
    LoginComponent,
    DocumentsComponent,
    RegisterComponent,
    HomeComponent // Ajout du DocumentsComponent ici si c'est un composant standalone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }