import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenStorageService, 
    private router: Router,
    private userService: UserService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    
    console.log('RoleGuard.canActivate called for route:', state.url);
    const isLoggedIn = !!this.tokenService.getToken();
    
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    const user = this.tokenService.getUser();
    
    // Vérification des rôles requis si présents
    if (route.data['roles']) {
      const requiredRoles = route.data['roles'] as Array<string>;
      const userRoles = user.roles;
      
      // Vérifier si l'utilisateur possède l'un des rôles requis
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        console.log('User does not have required roles:', requiredRoles);
        this.router.navigate(['/dashboard']);
        return false;
      }
    }
    
    // Vérification des privilèges basés sur la catégorie/sous-catégorie
    if (route.data['category']) {
      return this.userService.checkUserPrivilege(
        route.data['category'], 
        route.data['souscategory'] || null
      ).pipe(
        map(hasPrivilege => {
          if (!hasPrivilege) {
            console.log('User does not have required privileges for:', route.data['category']);
            this.router.navigate(['/dashboard']);
          }
          return hasPrivilege;
        }),
        catchError(error => {
          console.error('Error checking privileges:', error);
          this.router.navigate(['/dashboard']);
          return of(false);
        })
      );
    }
    
    return true;
  }
}