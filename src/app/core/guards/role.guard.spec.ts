import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { TokenStorageService } from '../services/token-storage.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let tokenServiceMock: jasmine.SpyObj<TokenStorageService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routeStateSnapshot: jasmine.SpyObj<RouterStateSnapshot>;

  beforeEach(() => {
    tokenServiceMock = jasmine.createSpyObj('TokenStorageService', ['getToken', 'getUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', [], { url: '/admin' });
    
    routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.data = { roles: ['ROLE_ADMIN'] };

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: TokenStorageService, useValue: tokenServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    
    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when user is not logged in', () => {
    tokenServiceMock.getToken.and.returnValue(null);
    
    const result = guard.canActivate(routeSnapshot, routeStateSnapshot);
    
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/admin' } });
  });

  it('should allow access when user has the required role', () => {
    tokenServiceMock.getToken.and.returnValue('some-token');
    tokenServiceMock.getUser.and.returnValue({ roles: ['ROLE_ADMIN'] });
    
    const result = guard.canActivate(routeSnapshot, routeStateSnapshot);
    
    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to home when user does not have the required role', () => {
    tokenServiceMock.getToken.and.returnValue('some-token');
    tokenServiceMock.getUser.and.returnValue({ roles: ['ROLE_USER'] });
    
    const result = guard.canActivate(routeSnapshot, routeStateSnapshot);
    
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});