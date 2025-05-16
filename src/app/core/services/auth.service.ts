import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username,
      email,
      password
    }, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', {}, httpOptions);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth-token');
    return !!token;
  }

  // Obtenir le token d'authentification
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  // Enregistrer le token dans le stockage local
  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'password/reset-request', 
      { email }, 
      httpOptions
    );
  }
  
  // Méthode pour réinitialiser le mot de passe avec un code
  resetPassword(token: string, newPassword: string): Observable<any> {
    // console.log('Envoi du token:', token); // Vérifiez la console
    return this.http.post(
      AUTH_API + 'password/reset', 
      { 
        token, 
        password: newPassword 
      }, 
      httpOptions
    ).pipe(
      catchError(error => {
        console.error('Détails de l\'erreur:', error);
        throw error;
      })
    );
  }

}
