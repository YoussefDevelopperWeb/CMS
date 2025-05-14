// home.component.ts - Mis à jour
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  
  features = [
    { 
      title: 'Gestion de contenu simplifiée', 
      description: 'Créez et gérez votre contenu facilement avec notre interface intuitive et nos outils puissants. Organisez vos médias et documents en quelques clics.'
    },
    { 
      title: 'Publication instantanée', 
      description: 'Publiez votre contenu sur toutes vos plateformes simultanément. Notre système vous permet de planifier et d\'automatiser vos publications pour une efficacité maximale.'
    },
    { 
      title: 'Publication', 
      description: 'Publiez votre contenu sur toutes vos plateformes simultanément.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  scrollToRegistration(): void {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  }
}





// home.component.ts
// import { CommonModule } from '@angular/common';
// import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService, User } from '../../../core/services/auth.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class HomeComponent implements OnInit, OnDestroy {
  
//   // Propriétés pour la navigation
//   isScrolled = false;
//   isMenuOpen = false;
//   activePage = 'home';
  
//   // Propriétés pour le dropdown utilisateur
//   isDropdownOpen = false;
//   isAuthenticated = false;
//   currentUser: User | null = null;
//   private authSubscription?: Subscription;
  
//   // Features existants de votre composant
//   features = [
//     { 
//       title: 'Gestion de contenu simplifiée', 
//       description: 'Créez et gérez votre contenu facilement avec notre interface intuitive et nos outils puissants. Organisez vos médias et documents en quelques clics.'
//     },
//     { 
//       title: 'Publication instantanée', 
//       description: 'Publiez votre contenu sur toutes vos plateformes simultanément. Notre système vous permet de planifier et d\'automatiser vos publications pour une efficacité maximale.'
//     },
//     { 
//       title: 'Publication', 
//       description: 'Publiez votre contenu sur toutes vos plateformes simultanément.'
//     }
//   ];

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     // Définir la page active basée sur l'URL actuelle
//     this.setActivePage(window.location.pathname);
    
//     // Subscribe to authentication state changes
//     this.authSubscription = this.authService.currentUser$.subscribe(user => {
//       this.currentUser = user;
//       this.isAuthenticated = !!user;
//     });
    
//     // Check authentication status on load
//     this.authService.checkAuthStatus().subscribe();
//   }
  
//   ngOnDestroy(): void {
//     // Clean up subscriptions to prevent memory leaks
//     if (this.authSubscription) {
//       this.authSubscription.unsubscribe();
//     }
//   }

//   // Méthode pour gérer le scroll de la page
//   @HostListener('window:scroll')
//   onWindowScroll(): void {
//     this.isScrolled = window.scrollY > 50;
//   }

//   // Méthode pour basculer le menu mobile
//   toggleMenu(): void {
//     this.isMenuOpen = !this.isMenuOpen;
//   }

//   // Méthode pour basculer le dropdown utilisateur
//   toggleDropdown(event: Event): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDropdownOpen = !this.isDropdownOpen;
    
//     // Add click outside listener when dropdown is opened
//     if (this.isDropdownOpen) {
//       setTimeout(() => {
//         window.addEventListener('click', this.closeDropdownOnClickOutside);
//       }, 0);
//     } else {
//       window.removeEventListener('click', this.closeDropdownOnClickOutside);
//     }
//   }
  
//   // Close dropdown when clicking outside
//   closeDropdownOnClickOutside = (): void => {
//     this.isDropdownOpen = false;
//     window.removeEventListener('click', this.closeDropdownOnClickOutside);
//   };

//   // Méthode pour définir la page active
//   setActivePage(path: string): void {
//     if (path === '/' || path === '') {
//       this.activePage = 'home';
//     } else if (path.includes('dashboard')) {
//       this.activePage = 'dashboard';
//     } else if (path.includes('features')) {
//       this.activePage = 'features';
//     } else if (path.includes('contact')) {
//       this.activePage = 'contact';
//     }
//   }

//   // Méthode pour obtenir les initiales de l'utilisateur
//   getUserInitials(): string {
//     if (!this.currentUser?.username) return 'U';
    
//     const nameParts = this.currentUser.username.split(' ');
//     if (nameParts.length > 1) {
//       return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
//     }
    
//     return this.currentUser.username.charAt(0).toUpperCase();
//   }

//   // Méthode pour la déconnexion
//   logout(): void {
//     this.authService.logout();
//     this.isDropdownOpen = false;
    
//     // Redirection vers la page d'accueil
//     this.router.navigate(['/']);
//   }

//   // Méthode existante pour le scroll vers la section d'inscription
//   scrollToRegistration(): void {
//     document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
//   }
// }