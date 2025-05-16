import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError,map  } from 'rxjs';
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



getUserDashboard(): Observable<any> {
    console.log('user')

    return this.http.get(`${API_URL}user/profile`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      map(user => {
    console.log(user)

        // Traiter le rôle principal de l'utilisateur
        if (user && (user as any).roles && (user as any).roles.length > 0) {
          // Extraire le rôle principal et le formater pour l'affichage
          let roleName = '';
          const userRoles = (user as any).roles;
          
          if (userRoles.length > 0) {
            // Vérifier si le rôle est un objet ou une chaîne de caractères
            if (typeof userRoles[0] === 'string') {
              roleName = userRoles[0].replace('ROLE_', '');
            } else if (userRoles[0].name) {
              roleName = userRoles[0].name.replace('ROLE_', '');
            }
            
            // Ajouter le rôle principal formaté à l'objet utilisateur
            (user as any).mainRole = roleName;
          }
        }
        return user;
      }),
      catchError(error => {
        console.error('Detailed error:', error);
        return throwError(() => error);
      })
    );
  }
getPrimaryRole(user: any): string {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'Utilisateur';
    }
    
    // Définir l'ordre de priorité des rôles
    const rolePriority = ['ROLE_SUPER', 'ROLE_ADMIN', 'ROLE_ARCH', 'ROLE_RESPO', 'ROLE_USER'];
    
    // Si le rôle est déjà défini dans mainRole, l'utiliser
    if (user.mainRole) {
      return user.mainRole;
    }
    
    // Sinon, déterminer le rôle principal en fonction des priorités
    let primaryRole = 'Utilisateur';
    let highestPriority = Number.MAX_VALUE;
    
    // Parcourir les rôles de l'utilisateur
    for (const role of user.roles) {
      const roleName = typeof role === 'string' ? role : (role.name || '');
      const priorityIndex = rolePriority.indexOf(roleName);
      
      if (priorityIndex !== -1 && priorityIndex < highestPriority) {
        highestPriority = priorityIndex;
        primaryRole = roleName.replace('ROLE_', '');
      }
    }
    
    return primaryRole;
  }





  /**
   * Met à jour uniquement le statut d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param userData Données avec uniquement l'état enabled
   * @returns Observable contenant la réponse
   */
  updateUserStatus(userId: number, userData: any): Observable<any> {
    return this.http.patch(`${API_URL}user/users/${userId}/status`, userData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error updating user status:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Filtre les administrateurs avec pagination côté serveur
   * @param filterParams Paramètres de filtrage
   * @returns Observable contenant les administrateurs paginés
   */
  filterAdmins(filterParams: any): Observable<any> {
    // Création du DTO dans le format attendu par le backend
    const filterDTO = {
      searchTerm: filterParams.searchTerm || '',
      
      // Déterminer quels modes de filtrage sont actifs
      usernameMode: filterParams.searchTerm ? 'active' : '',
      emailMode: filterParams.email ? 'active' : '',
      fonctionMode: filterParams.fonction ? 'active' : '',
      
      // Copier les autres filtres tels quels
      roleFilter: 'admins', // Toujours filtrer les admins
      statusFilter: filterParams.statusFilter || 'all',

      email: filterParams.email || '',
      fonction: filterParams.fonction || '',

      // Pagination avec itemsPerPage paramétrable
      page: filterParams.page || 1,
      itemsPerPage: filterParams.itemsPerPage || 10
    };
    
    return this.http.post<any>(`${API_URL}user/filter-admins`, filterDTO, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error filtering admins:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Filtre les utilisateurs avec pagination côté serveur
   * @param filterParams Paramètres de filtrage
   * @returns Observable contenant les utilisateurs paginés
   */
  filterUsers(filterParams: any): Observable<any> {
    // Création du DTO dans le format attendu par le backend
    const filterDTO = {
      searchTerm: filterParams.searchTerm || '',
      
      // Déterminer quels modes de filtrage sont actifs
      usernameMode: filterParams.searchTerm ? 'active' : '',
      emailMode: filterParams.email ? 'active' : '',
      fonctionMode: filterParams.fonction ? 'active' : '',
      
      // Copier les autres filtres tels quels
      roleFilter: filterParams.roleFilter || 'all',
      statusFilter: filterParams.statusFilter || 'all',

      email: filterParams.email || '',
      fonction: filterParams.fonction || '',

      // Pagination
      page: filterParams.page || 1,
      itemsPerPage: filterParams.itemsPerPage || 10
    };
    
    return this.http.post<any>(`${API_URL}user/filter-users`, filterDTO, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error filtering users:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère la liste des rôles disponibles
   */
  getRoles(): Observable<any> {
    return this.http.get(`${API_URL}user/roles`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      })
    }).pipe(
      catchError(error => {
        console.error('Error getting roles:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère la liste des administrateurs
   */
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

  /**
   * Récupère la liste des utilisateurs réguliers
   */
  getAllRegularUsers(): Observable<any> {
    return this.http.get(`${API_URL}user/regular-users`, {
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

  /**____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
   * Récupère les données du tableau de bord utilisateur
   */






  /**____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
   * Récupère tous les utilisateurs
   */
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

  /**
   * Met à jour un utilisateur
   * @param userId ID de l'utilisateur
   * @param userDetails Détails de l'utilisateur
   * @returns Observable contenant la réponse
   */
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

  /**
   * Supprime un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Observable contenant la réponse
   */
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

  /**
   * Charge les données du tableau de bord utilisateur
   */
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

  checkUserPrivilege(category: string, souscategory: string | null): Observable<boolean> {
    return this.http.post<boolean>(API_URL + 'check-privilege', {
      category,
      souscategory
    }).pipe(
      catchError(error => {
        console.error('Error checking privilege:', error);
        return of(false);
      })
    );
  }
}