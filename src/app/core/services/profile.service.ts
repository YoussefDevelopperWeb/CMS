import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { User } from '../../features/dashboard/profile/profile.component';
import { RoleService } from './role.service';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private roleService: RoleService
  ) { }

  // /**
  //  * Récupère les données du profil de l'utilisateur connecté
  //  */
  // getUserProfile(): Observable<User> {
  //   console.log('profile')
  //   return this.http.get<User>(`${API_URL}user/profile`, {
  //     headers: this.getAuthHeaders()
  //   }).pipe(
  //     map(user => {
  //       return user;
  //     }),
  //     catchError(error => {
  //       console.error('Erreur lors de la récupération du profil utilisateur:', error);
  //       throw error;
  //     })
  //   );
  // }

  /**
   * Met à jour le profil de l'utilisateur
   * @param profileData Les données du profil à mettre à jour
   */
  updateUserProfile(profileData: User): Observable<any> {
    return this.http.put(`${API_URL}user/edit/profile`, profileData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
        throw error;
      })
    );
  }


  /**
   * Helper pour obtenir les en-têtes d'authentification
   */
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    });
  }
}