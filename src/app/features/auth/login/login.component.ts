import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        // Messages d'erreur plus spécifiques et en français
        if (err.error) {
          switch (err.error.message) {
            case 'User not found':
              this.errorMessage = "L'utilisateur n'existe pas.";
              break;
            case 'Invalid password':
              this.errorMessage = "Le mot de passe est incorrect.";
              break;
            case 'User is disabled':
              this.errorMessage = "Votre compte est désactivé. Veuillez contacter un administrateur.";
              break;
            case 'Bad credentials':
              this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
              break;
            default:
              this.errorMessage = err.error.message || "La connexion a échoué. Veuillez réessayer.";
          }
        } else {
          this.errorMessage = "Impossible de se connecter au serveur. Veuillez réessayer plus tard.";
        }
        this.isLoginFailed = true;
      }
    });
  }
}