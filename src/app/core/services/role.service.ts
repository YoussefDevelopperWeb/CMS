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

  // Récupérer le nom d'affichage d'un rôle
  getRoleDisplayName(id: number): Observable<any> {
    return this.http.get(`${API_URL}roles/${id}/display-name`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting display name for role with ID ${id}:`, error);
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

  // Récupérer les privilèges d'un rôle
  getRolePrivileges(id: number): Observable<any> {
    return this.http.get(`${API_URL}roles/${id}/privileges`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error(`Error getting privileges for role with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Assigner des privilèges à un rôle
assignPrivilegesToRole(roleId: number, privilegeIds: number[]): Observable<any> {
  const privilegeData = {
    roleId: roleId,
    privilegeIds: privilegeIds
  };
  console.log(privilegeData)
  return this.http.post(`${API_URL}privileges/roles/${roleId}/batch`, privilegeData, {
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