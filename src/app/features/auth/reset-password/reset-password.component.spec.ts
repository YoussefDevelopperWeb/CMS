import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Création des spies
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'requestPasswordReset', 
      'resetPassword'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    // Initialisation des composants et services
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Configurations par défaut des mocks
    authService.requestPasswordReset.and.returnValue(of({ message: 'Email sent' }));
    authService.resetPassword.and.returnValue(of({ message: 'Success' }));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with request step', () => {
      expect(component.resetStep).toBe('request');
    });

    it('should process token from URL if present', () => {
      // Mock URLSearchParams
      const originalURLSearchParams = window.URLSearchParams;
      window.URLSearchParams = class {
        get = () => 'test-token';
      } as any;
      
      component.ngOnInit();
      
      expect(component.form.code).toBe('test-token');
      expect(component.resetStep).toBe('reset');
      
      // Restore original
      window.URLSearchParams = originalURLSearchParams;
    });
  });

  describe('Password Reset Request', () => {
    it('should validate email before submission', () => {
      component.requestForm.email = '';
      component.onRequestCode();
      
      expect(authService.requestPasswordReset).not.toHaveBeenCalled();
      expect(component.isRequestFailed).toBeTrue();
    });
    
    it('should call authService for valid email', () => {
      component.requestForm.email = 'test@example.com';
      component.onRequestCode();
      
      expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
      expect(component.isCodeSent).toBeTrue();
    });

    it('should handle request error', () => {
      authService.requestPasswordReset.and.returnValue(
        throwError(() => ({ error: { message: 'User not found' } }))
      );
      component.requestForm.email = 'test@example.com';
      
      component.onRequestCode();
      
      expect(component.isRequestFailed).toBeTrue();
      expect(component.requestErrorMessage).toBe('User not found');
    });
  });

  describe('Password Reset Submission', () => {
    beforeEach(() => {
      component.resetStep = 'reset';
      component.form = {
        code: 'valid-token',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      };
    });

    it('should validate required fields', () => {
      component.form.code = '';
      component.onSubmit();
      
      expect(authService.resetPassword).not.toHaveBeenCalled();
      expect(component.isResetFailed).toBeTrue();
    });
    
    it('should verify password match', () => {
      component.form.confirmPassword = 'differentPassword';
      component.onSubmit();
      
      expect(component.passwordsNotMatching).toBeTrue();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('should submit when all valid', () => {
      component.onSubmit();
      
      expect(authService.resetPassword).toHaveBeenCalledWith(
        'valid-token', 
        'newPassword123'
      );
      expect(component.isResetSuccess).toBeTrue();
    });

    it('should handle reset error', () => {
      authService.resetPassword.and.returnValue(
        throwError(() => ({ error: { message: 'Invalid token' } }))
      );
      
      component.onSubmit();
      
      expect(component.isResetFailed).toBeTrue();
      expect(component.errorMessage).toBe('Invalid token');
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.navigateToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTrue();
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeFalse();
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBeFalse();
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeTrue();
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBeFalse();
    });
  });
});