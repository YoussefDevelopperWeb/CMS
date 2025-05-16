import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    acceptedTerms: false
  };
  
  // États UI
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  showPassword = false;
  
  // Mesure pour optimisation responsive
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
  
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private tokenStorage: TokenStorageService
  ) {}
  
  // Surveille les changements de taille d'écran pour optimisation responsive
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  
  ngOnInit(): void {
    // Redirection si déjà connecté
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/dashboard']);
    }
    
    // Mesure initiale pour optimisation responsive
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  
  onSubmit(): void {
    const { username, email, password } = this.form;
    
    // Vérifier que les conditions sont acceptées
    if (!this.form.acceptedTerms) {
      this.isSignUpFailed = true;
      this.errorMessage = "Vous devez accepter les conditions d'utilisation";
      return;
    }
    
    this.authService.register(username, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        
        // Animation de succès puis redirection
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || "Une erreur s'est produite lors de l'inscription";
        this.isSignUpFailed = true;
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  signInWithGoogle(): void {
    // Implémentation future de l'authentification Google
    console.log('Tentative de connexion avec Google');
    
    // Pour démonstration seulement
    alert('Redirection vers l\'authentification Google...');
    
    // Décommenter et implémenter quand prêt
    // window.location.href = 'http://localhost:8080/api/auth/google';
  }
  
  // Empêche le défilement global
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // Si ce n'est pas dans un élément défilable, prévenir le défilement
    if (!this.isInScrollableArea(event.target as HTMLElement)) {
      event.preventDefault();
    }
  }
  
  // Utilitaire pour déterminer si un élément est dans une zone défilable
  private isInScrollableArea(element: HTMLElement | null): boolean {
    // Remontez la hiérarchie des éléments pour trouver une zone défilable
    while (element && element !== document.body) {
      // Vérifie si l'élément a un défilement visible
      const hasVerticalScroll = element.scrollHeight > element.clientHeight && 
        (window.getComputedStyle(element).overflowY === 'auto' || 
         window.getComputedStyle(element).overflowY === 'scroll');
      
      if (hasVerticalScroll) {
        return true;
      }
      
      element = element.parentElement;
    }
    
    return false;
  }
}