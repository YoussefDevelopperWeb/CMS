// Extension du service AuthService pour le composant Documents

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

  // Méthodes existantes
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

  // Nouvelles méthodes pour le composant Documents
  
  // Alias pour isLoggedIn, utilisé par le composant Documents
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
  
  // Vérifier si l'utilisateur a un des rôles spécifiés
  hasRole(roles: string[]): boolean {
    // Récupérer les rôles de l'utilisateur depuis le token ou le stockage local
    // Cette implémentation est un exemple, à adapter selon votre logique d'authentification
    const userRoles = this.getUserRoles();
    
    // Vérifier si l'utilisateur a au moins un des rôles requis
    return roles.some(role => userRoles.includes(role));
  }
  
  // Obtenir les rôles de l'utilisateur
  private getUserRoles(): string[] {
    // Cette méthode doit être adaptée à votre logique d'authentification
    // Exemple : décoder le JWT pour extraire les rôles
    
    // Si vous stockez les rôles dans localStorage
    const rolesString = localStorage.getItem('user-roles');
    if (rolesString) {
      return JSON.parse(rolesString);
    }
    
    // Par défaut, retourner un tableau vide
    return [];
  }
  
  // Méthode pour sauvegarder les rôles de l'utilisateur (à appeler après login)
  saveUserRoles(roles: string[]): void {
    localStorage.setItem('user-roles', JSON.stringify(roles));
  }
}