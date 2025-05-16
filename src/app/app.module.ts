import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { HomeContentComponent } from './features/dashboard/main/home-main/home-main.component';
import { UsersComponent } from './features/dashboard/main/gestion/users/users.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    UsersComponent,
    HomeContentComponent,
    ResetPasswordComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }