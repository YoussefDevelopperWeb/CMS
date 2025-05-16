// src/app/core/services/privilege.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {
  private apiUrl = `http://localhost:8080/api/privileges`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les privilèges
  getAllPrivileges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Récupérer les privilèges d'un rôle spécifique
  getRolePrivileges(roleId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/roles/${roleId}/privileges`);
  }

  // Assigner des privilèges à un rôle
  assignPrivilegesToRole(roleId: number, privilegeIds: number[]): Observable<any> {
    return this.http.post(`http://localhost:8080/api/roles/${roleId}/privileges/batch`, privilegeIds);
  }

  // Mettre à jour un privilège spécifique pour un rôle
  updateRolePrivilege(roleId: number, privilegeId: number, status: boolean): Observable<any> {
    return this.http.put(`http://localhost:8080/api/roles/${roleId}/privileges/${privilegeId}`, { statut: status });
  }
}