import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  errorMessage: string | undefined;
  dashboardData: any;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) { }

  // Méthode pour récupérer uniquement les admins - pour super admin uniquement
  getAllAdmins(): Observable<any> {
    return this.http.get(`${API_URL}user/admins`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting admins:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour récupérer tous les utilisateurs (rôle USER) - pour admin et super admin
  getAllRegularUsers(): Observable<any> {
    return this.http.get(`${API_URL}user/users`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting regular users:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour récupérer les données du dashboard
  getUserDashboard(): Observable<any> {
    return this.http.get(`${API_URL}user/dashboard`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Detailed error:', error);
        return throwError(() => error);
      })
    );
  }


  // Méthode pour récupérer tous les utilisateurs et admins - pour super admin uniquement
  getAllUsers(): Observable<any> {
    return this.http.get(`${API_URL}user/all-users`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting all users:', error);
        return throwError(() => error);
      })
    );
  }



  // Méthode pour mettre à jour un utilisateur spécifique
  updateUser(userId: number, userDetails: any): Observable<any> {
    return this.http.put(`${API_URL}user/users/${userId}`, userDetails, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${API_URL}user/users/${userId}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour charger les données du dashboard
  loadUserDashboard() {
    this.getUserDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Error loading user dashboard:', err);
        if (err.status === 401 || err.status === 403) {
          console.log('Authentication issue - try logging in again');
        } else if (err.status === 500) {
          console.log('Server error details:', err.error);
          this.errorMessage = 'Unable to load dashboard. Please try again later.';
        }
      }
    });
  }

  // Méthode pour mettre à jour les données du dashboard de l'utilisateur connecté
  updateUserDashboard(userDetails: any): Observable<any> {
    return this.http.put(API_URL + 'user/dashboard', userDetails, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    });
  }

  // Services pour les contenus publics et protégés
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'test/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/user', {
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/admin', {
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    });
  }

  // Nouveau service pour le tableau de bord du super admin
  getSuperAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'test/super', {
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${API_URL}user/users`, userData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }
  
}