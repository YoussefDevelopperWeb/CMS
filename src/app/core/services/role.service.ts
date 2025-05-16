import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/';

export interface Role {
  id?: number;
  name: string;
  description?: string;
  statut: boolean; // Uniformiser en utilisant seulement statut de type boolean
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) { }

  // Récupérer tous les rôles
  getAllRoles(): Observable<any> {
    return this.http.get(`${API_URL}roles/roles`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting all roles:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer un rôle par ID
  getRoleById(id: number): Observable<any> {
    return this.http.get(`${API_URL}roles/${id}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting role with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Créer un nouveau rôle
  createRole(role: Role): Observable<any> {
    return this.http.post(`${API_URL}roles`, role, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error creating role:', error);
        return throwError(() => error);
      })
    );
  }

  // Mettre à jour un rôle existant
  updateRole(id: number, role: Role): Observable<any> {
    return this.http.put(`${API_URL}roles/${id}`, role, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error updating role with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Supprimer un rôle
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${API_URL}roles/${id}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error deleting role with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }



  // Filtrer les rôles par nom ou statut
  filterRoles(filterParams: any): Observable<any> {
    return this.http.post<any>(`${API_URL}roles/filter`, filterParams, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error filtering roles:', error);
        return throwError(() => error);
      })
    );
  }
}