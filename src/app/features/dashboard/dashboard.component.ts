import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { ProfileService } from '../../core/services/profile.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Variables pour les utilisateurs
  currentUser: any;
  userDetails: any;
  username: string = '';
  userRole: string = 'Utilisateur';
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  // Variables pour le menu
  expandedMenus: Set<string> = new Set(); // Pour suivre les menus déployés
  expandedSubmenus: Set<string> = new Set(); // Pour suivre les sous-menus déployés
  isCollapsed: boolean = false;
  isMobileOpen: boolean = false;
  
  // Variables pour le logo et les assets
  logoUrl: string = 'assets/images/image.png';
  logoIconUrl: string = 'assets/images/image1.png';
  
  // Variable pour l'état de chargement
  isLoading: boolean = true;

  // Variables pour les messages et états
  message: string = '';
  
  // Variable pour suivre la dernière URL
  lastRoute: string = '';

  constructor(
    private router: Router,
    private token: TokenStorageService,
    private userService: UserService,
    private authService: AuthService,
    private profileService: ProfileService,
    private cdRef: ChangeDetectorRef,
    private location: Location
  ) {
    // S'abonner à tous les événements de navigation pour mieux contrôler le comportement
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        // Enregistrer la route précédente
        this.lastRoute = event.url;
        
        // Mettre à jour l'état du menu
        this.updateMenuStateFromRoute();
        
        // Simuler un rechargement en ajoutant une petite animation de chargement
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.cdRef.detectChanges(); // Forcer la détection des changements
        }, 300); // Juste assez de temps pour montrer le spinner
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    
    // Simuler un délai de chargement pour montrer le spinner
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
    
    // Charger les données de l'utilisateur connecté
    this.currentUser = this.token.getUser();
    
    if (!this.currentUser) {
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    // Vérifier les rôles de l'utilisateur
    this.checkUserRole();
    
    // Charger les données du dashboard
    this.loadUserDashboard();
    
    // Vérifier la taille de l'écran pour le comportement responsive
    this.checkScreenSize();
    
    // Mettre à jour l'état des menus en fonction de la route actuelle
    this.updateMenuStateFromRoute();
    
    // Enregistrer la route actuelle
    this.lastRoute = this.router.url;
  }

  ngAfterViewInit(): void {
    // Ajouter un écouteur d'événement pour les clics en dehors sur mobile
    document.addEventListener('click', (event: MouseEvent) => {
      // Vérifier si on est sur mobile et si le menu est ouvert
      if (this.isMobile() && this.isMobileOpen) {
        // Vérifier si le clic est en dehors du sidebar et du bouton toggle
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.mobile-toggle');
        const target = event.target as HTMLElement;
        
        if (sidebar && !sidebar.contains(target) && 
            toggleBtn && !toggleBtn.contains(target)) {
          this.closeMobileMenu();
        }
      }
    });
  }

  // Gérer l'état des menus selon la route actuelle
  updateMenuStateFromRoute(): void {
    const url = this.router.url;
    console.log('Current URL:', url);
    
    // Déployer les menus correspondants à la route actuelle
    if (url.includes('/librairie')) {
      this.expandedMenus.add('Librairie');
      
      if (url.includes('/web/')) {
        this.expandedSubmenus.add('Web');
      }
    }
    
    if (url.includes('/gestion')) {
      this.expandedMenus.add('Gestion');
    }
  }

  // Vérifier si un menu doit être affiché comme déployé
  isMenuExpanded(menu: string): boolean {
    return this.expandedMenus.has(menu);
  }
  
  // Vérifier si un sous-menu doit être affiché comme déployé
  isSubmenuExpanded(submenu: string): boolean {
    return this.expandedSubmenus.has(submenu);
  }
  
  // Gérer l'état d'un menu principal (Librairie, Gestion)
  toggleMenu(menu: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Si le menu est déjà ouvert, le fermer
    if (this.expandedMenus.has(menu)) {
      this.expandedMenus.delete(menu);
    } else {
      // Ouvrir le menu
      this.expandedMenus.add(menu);
    }
    
    // Garder le menu ouvert sur mobile
    if (this.isMobile()) {
      this.isMobileOpen = true;
    }
  }
  
  // Gérer l'état d'un sous-menu (Web, Mobile, etc.)
  toggleSubmenu(submenu: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Si le sous-menu est ouvert, le fermer
    if (this.expandedSubmenus.has(submenu)) {
      this.expandedSubmenus.delete(submenu);
    } else {
      // Ouvrir le sous-menu
      this.expandedSubmenus.add(submenu);
    }
    
    // Ne pas naviguer automatiquement quand on ouvre/ferme le sous-menu
    // La navigation doit se faire uniquement quand on clique sur un élément spécifique
    
    // Garder le menu ouvert sur mobile
    if (this.isMobile()) {
      this.isMobileOpen = true;
    }
  }
  
  // Vérifier si une route est active
  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
  
  // Vérifier si une section de librairie est active
  isLibrairieActive(): boolean {
    return this.router.url.includes('/dashboard/librairie');
  }
  
  // Vérifier si une section web est active
  isWebActive(): boolean {
    return this.router.url.includes('/dashboard/librairie/web');
  }
  
  // Vérifier si une section de gestion est active
  isGestionActive(): boolean {
    return this.router.url.includes('/dashboard/gestion');
  }
  
  // Naviguer vers une route
  navigateTo(route: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('Navigating to:', route);
    
    // Si on est déjà sur cette route, forcer le rechargement du composant
    if (this.router.url === route) {
      this.refreshCurrentRoute();
      return;
    }
    
    // Marquer les menus appropriés comme ouverts
    if (route.includes('/librairie')) {
      this.expandedMenus.add('Librairie');
      
      if (route.includes('/web/')) {
        this.expandedSubmenus.add('Web');
      }
    } else if (route.includes('/gestion')) {
      this.expandedMenus.add('Gestion');
    }
    
    // Activer l'overlay de chargement
    this.isLoading = true;
    
    // Naviguer vers la nouvelle route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([route]).then(() => {
        // Désactiver l'overlay de chargement après un court délai
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      });
    });
    
    // Sur très petits écrans, fermer le menu après navigation
    if (this.isSmallMobile()) {
      this.isMobileOpen = false;
    }
  }
  
  // Méthode pour rafraîchir la route actuelle
  refreshCurrentRoute(): void {
    const currentRoute = this.router.url;
    
    // Activer l'overlay de chargement
    this.isLoading = true;
    
    // Utiliser skipLocationChange pour éviter d'ajouter des entrées à l'historique
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]).then(() => {
        // Désactiver l'overlay de chargement après un court délai
        setTimeout(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }, 300);
      });
    });
  }

  loadUserDashboard(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  checkUserRole(): void {
    // Vérifier les rôles de l'utilisateur
    this.username = this.currentUser.username
    this.userRole = this.currentUser.roles[0]
    if (this.currentUser && this.currentUser.roles) {
      if (Array.isArray(this.currentUser.roles)) {
        this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');
        this.isSuperAdmin = this.currentUser.roles.includes('ROLE_SUPER');
      } else if (typeof this.currentUser.roles === 'object') {
        // Cas où roles est un objet
        this.isAdmin = Object.values(this.currentUser.roles).includes('ROLE_ADMIN');
        this.isSuperAdmin = Object.values(this.currentUser.roles).includes('ROLE_SUPER');
      }
    }
  }

  toggleMobileMenu(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Empêcher la propagation pour éviter les conflits
    }
    this.isMobileOpen = !this.isMobileOpen;
  }

  // Méthode pour basculer l'état du collapse du sidebar
  toggleCollapse(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Empêcher la propagation pour éviter les conflits
    }
    this.isCollapsed = !this.isCollapsed;
  }

  checkScreenSize(): void {
    // Responsive behavior for the menu
    if (window.innerWidth >= 992) {
      // Sur desktop, le sidebar reste visible mais peut être collapsé
      if (!this.isMobileOpen) {
        this.isMobileOpen = true;
      }
    } else if (window.innerWidth < 768) {
      // Sur mobile, le sidebar est caché par défaut
      this.isMobileOpen = false;
    }
  }

  // Check if screen is mobile
  isMobile(): boolean {
    return window.innerWidth < 992;
  }

  // Check if screen is very small
  isSmallMobile(): boolean {
    return window.innerWidth < 768;
  }

  // Get user initials for avatar
  getUserInitials(): string {
    if (!this.username) return 'U';
    const nameParts = this.username.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return this.username.substring(0, 2).toUpperCase();
  }

  // Clean up on component destroy
  ngOnDestroy(): void {
    // Nettoyer les écouteurs d'événements pour éviter les fuites de mémoire
    document.removeEventListener('click', this.closeMobileMenu.bind(this));
  }

  closeMobileMenu(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Empêcher la propagation pour éviter les conflits
    }
    
    // Ne fermer le menu mobile que sur très petits écrans
    if (this.isSmallMobile()) {
      this.isMobileOpen = false;
    }
  }

  logout(): void {
    this.token.signOut(); // Toujours faire le signOut local en premier

    // Essayer de se déconnecter côté serveur
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
        // Nous avons déjà fait le signOut local, donc rediriger quand même
        this.router.navigate(['/login']);
      }
    });
  }
}