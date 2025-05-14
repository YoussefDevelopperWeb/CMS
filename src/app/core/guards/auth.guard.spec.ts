import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { TokenStorageService } from '../services/token-storage.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenStorageService>;
  let router: jasmine.SpyObj<Router>;
  
  beforeEach(() => {
    // Création de spies pour les services
    const tokenServiceSpy = jasmine.createSpyObj('TokenStorageService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenStorageService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    // Récupérer les instances
    guard = TestBed.inject(AuthGuard);
    tokenService = TestBed.inject(TokenStorageService) as jasmine.SpyObj<TokenStorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activated route when user is logged in', () => {
    // Configuration du mock pour simuler un utilisateur connecté
    tokenService.getToken.and.returnValue('fake-token');
    
    // Création de dummy route et state
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/protected' } as RouterStateSnapshot;
    
    // Test de la garde
    const result = guard.canActivate(dummyRoute, dummyState);
    
    // Vérifications
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not logged in', () => {
    // Configuration du mock pour simuler un utilisateur non connecté
    tokenService.getToken.and.returnValue(null);
    
    // Création de dummy route et state
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/protected' } as RouterStateSnapshot;
    
    // Test de la garde
    const result = guard.canActivate(dummyRoute, dummyState);
    
    // Vérifications
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/login'], 
      { queryParams: { returnUrl: '/protected' } }
    );
  });
});