import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
  successMessage = '';
  showPassword = false;
  roles: string[] = [];
  
  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    console.log('LoginComponent initialized');
    // Si l'utilisateur est déjà connecté, rediriger immédiatement vers dashboard
    if (this.tokenStorage.getToken()) {
      console.log('User already logged in, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
      return; // Arrêter l'exécution de ngOnInit ici
    }
    
    // Vérifie si une redirection vient d'avoir lieu (par exemple, après inscription)
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    
    if (successParam === 'register') {
      this.successMessage = 'Votre inscription a été effectuée avec succès. Vous pouvez maintenant vous connecter.';
    }
  }
  
  onSubmit(): void {
    const { username, password } = this.form;
    console.log('Attempting login for user:', username);
    
    this.authService.login(username, password).subscribe({
      next: data => {
        console.log('Login successful:', data);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        
        // Rediriger immédiatement sans afficher de message
        console.log('Redirecting to dashboard');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.isLoginFailed = true;
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}