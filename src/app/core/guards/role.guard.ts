import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private tokenService: TokenStorageService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const isLoggedIn = !!this.tokenService.getToken();
    
    if (!isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    // Vérification des rôles requis
    const requiredRoles = route.data['roles'] as Array<string>;
    const user = this.tokenService.getUser();
    const userRoles = user.roles;
    
    // Vérifier si l'utilisateur possède l'un des rôles requis
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      this.router.navigate(['/home']);
      return false;
    }
    
    return true;
  }
}