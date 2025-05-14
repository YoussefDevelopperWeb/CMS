import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ResetPasswordComponent implements OnInit {
  form: {
    code: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  } = {
    code: null,
    newPassword: null,
    confirmPassword: null
  };
 
  requestForm: {
    email: string | null;
  } = {
    email: null
  };
 
  isResetFailed = false;
  isResetSuccess = false;
  isRequestFailed = false;
  isCodeSent = false;
  errorMessage = '';
  requestErrorMessage = '';
  passwordsNotMatching = false;
  showPassword = false;
  showConfirmPassword = false;
 
  // Étapes: 'request' (demande de code) ou 'reset' (réinitialisation)
  resetStep: 'request' | 'reset' = 'request';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Vérifier si un token est déjà présent dans l'URL (Spring Security envoie souvent un token)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
   
    if (token) {
      this.form.code = token; // Spring Boot utilise généralement un token plutôt qu'un code
      this.resetStep = 'reset';
    }
  }

  onRequestCode(): void {
    const { email } = this.requestForm;
    
    if (!email) {
      this.isRequestFailed = true;
      this.requestErrorMessage = "L'adresse email est requise";
      return;
    }
   
    // Appel au service Spring Boot pour demander la réinitialisation
    
    this.authService.requestPasswordReset(email).subscribe({
      
      next: (response: any) => {
        this.isCodeSent = true;
        this.isRequestFailed = false;
        // Spring renvoie généralement un message de confirmation
        console.log('Email envoyé avec succès:', response?.message || 'Succès');
      },
      
      error: (err: HttpErrorResponse) => {
        this.isRequestFailed = true;
        this.extractErrorMessage(err);
        console.error('Erreur de demande de réinitialisation:', err);
      }
      
    });
  }

  onSubmit(): void {
    const { code, newPassword, confirmPassword } = this.form;
    
    if (!code || !newPassword || !confirmPassword) {
      this.isResetFailed = true;
      this.errorMessage = "Tous les champs sont requis";
      return;
    }
   
    // Vérifier si les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      this.passwordsNotMatching = true;
      return;
    }
   
    this.passwordsNotMatching = false;
   
    // Appel au service Spring Boot pour réinitialiser le mot de passe
    this.authService.resetPassword(code, newPassword).subscribe({
      next: (response: any) => {
        this.isResetSuccess = true;
        this.isResetFailed = false;
        console.log('Mot de passe réinitialisé avec succès:', response?.message || 'Succès');
      },
      error: (err: HttpErrorResponse) => {
        this.isResetFailed = true;
        this.extractErrorMessage(err);
        console.error('Erreur de réinitialisation:', err);
        this.isResetSuccess = false;
      }
    });
  }

  // Méthode d'extraction des messages d'erreur Spring Boot
  private extractErrorMessage(err: HttpErrorResponse): void {
    if (err.error) {
      if (err.error.message) {
        this.requestErrorMessage = err.error.message;
        this.errorMessage = err.error.message;
      } else if (err.error.error) {
        // Pour les erreurs Spring qui incluent un champ 'error'
        this.requestErrorMessage = err.error.error;
        this.errorMessage = err.error.error;
      } else if (typeof err.error === 'string') {
        this.requestErrorMessage = err.error;
        this.errorMessage = err.error;
      } else {
        this.requestErrorMessage = `Erreur ${err.status}: ${err.statusText}`;
        this.errorMessage = `Erreur ${err.status}: ${err.statusText}`;
      }
    } else {
      this.requestErrorMessage = 'Une erreur est survenue lors de la communication avec le serveur';
      this.errorMessage = 'Une erreur est survenue lors de la communication avec le serveur';
    }
  }

  // Méthodes pour la visibilité des mots de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}