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
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      
      // Redirige l'utilisateur vers le tableau de bord s'il est déjà connecté
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
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
    
    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        
        this.errorMessage = '';
        this.successMessage = 'Connexion réussie ! Vous allez être redirigé...';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.isLoginFailed = true;
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  signInWithGoogle(): void {
    // Implémentation de la connexion avec Google
    console.log('Tentative de connexion avec Google');
    
    // Pour démonstration seulement - à remplacer par l'implémentation réelle
    alert('Redirection vers l\'authentification Google...');
    
    // Exemple de redirection vers une API OAuth
    // window.location.href = 'http://localhost:8080/api/auth/google';
  }
}