import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/';

export interface Privilege {
  id?: number;
  name: string;
  category: string;
  subcategory?: string;
  souscategory?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) { }

  // Récupérer tous les privilèges
  getAllPrivileges(): Observable<any> {
    return this.http.get(`${API_URL}privileges`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting all privileges:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer un privilège par ID
  getPrivilegeById(id: number): Observable<any> {
    return this.http.get(`${API_URL}privileges/${id}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting privilege with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les privilèges par catégorie
  getPrivilegesByCategory(category: string): Observable<any> {
    return this.http.get(`${API_URL}privileges/category/${category}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting privileges for category ${category}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les privilèges par sous-catégorie
  getPrivilegesBySubcategory(subcategory: string): Observable<any> {
    return this.http.get(`${API_URL}privileges/subcategory/${subcategory}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting privileges for subcategory ${subcategory}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les privilèges d'un rôle
  getRolePrivileges(roleId: number): Observable<any> {
    return this.http.get(`${API_URL}roles/${roleId}/privileges`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting privileges for role with ID ${roleId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Assigner plusieurs privilèges à un rôle
  assignPrivilegesToRole(roleId: number, privilegeIds: number[]): Observable<any> {
    // CORRECTION: Envoyer directement le tableau des IDs (comme attendu par le backend)
    return this.http.post(`${API_URL}privileges/roles/${roleId}/batch`, privilegeIds, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken(),
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        console.error(`Error assigning privileges to role with ID ${roleId}:`, error);
        return throwError(() => error);
      })
    );
  }
}