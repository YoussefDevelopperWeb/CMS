import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

import { FormsModule } from '@angular/forms';

import { UsersComponent } from './main/gestion/users/users.component';
import { ImagesComponent } from './main/librairie/web/images/images.component';
import { VideosComponent } from './main/librairie/web/videos/videos.component';
import { PictosComponent } from './main/librairie/web/pictos/pictos.component';
import { DocumentsComponent } from './main/librairie/web/documents/documents.component';
import { RolesComponent } from './main/gestion/roles/roles.component';
import { CampagnesComponent } from "./main/librairie/campagnes/campagnes.component";
import { PlvComponent } from "./main/librairie/plv/plv.component";
import { MobileComponent } from "./main/librairie/mobile/mobile.component";
import { SocialMediaComponent } from "./main/librairie/social-media/social-media.component";
// import { ProfilesComponent } from './main/profile/profile.component';
import { HomeContentComponent } from './main/home-main/home-main.component';
import { AdminsComponent } from './main/gestion/admins/admins.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [AdminsComponent, CommonModule, FormsModule, HomeContentComponent, ImagesComponent, VideosComponent, PictosComponent, DocumentsComponent, UsersComponent, RolesComponent, CampagnesComponent, PlvComponent, MobileComponent, SocialMediaComponent]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Variables du Dashboard
  currentUser: any;
  userDetails: any;
  isEditing = false;
  message = '';
  isUpdateSuccess = false;
  isUpdateFailed = false;

  // Variables du dashboard
  username: string = '';
  selectedMenu: string = 'Accueil';
  previouslySelectedMenu: string = ''; // Pour stocker le menu précédemment sélectionné
  selectedLibraryItem: string = '';
  selectedWebItem: string = '';
  mobileMenuOpen: boolean = false;
  
  // Nouvelle variable pour contrôler l'affichage des composants
  showHomeContent: boolean = true; // Toujours afficher le contenu d'accueil
  
  // Variables pour contrôler l'affichage des autres composants
  showImages: boolean = false;
  showVideos: boolean = false;
  showPictos: boolean = false;
  showDocuments: boolean = false;

  showMobile: boolean = false;
  showPlv: boolean = false;
  showSocialMedia: boolean = false;
  showCampagnes: boolean = false;

  showAccueil: boolean = false;
  showUsers: boolean = false;
  showRoles: boolean = false;
  showAdmins: boolean = false; // Ajout de la variable manquante pour AdminsComponent

  showProfiles: boolean = false;

  // Variable pour stocker la vue active actuelle
  activeView: string = 'Accueil';

  // Variable pour le rôle de l'utilisateur
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false; // Ajout du rôle super admin
  usersList: any[] = []; // Pour stocker la liste des utilisateurs

  // Propriétés manquantes pour le menu sidebar
  isCollapsed: boolean = false;
  isMobileOpen: boolean = false;
  logoUrl: string = 'assets/images/image.png'; // Ajustez ces chemins selon votre structure
  logoIconUrl: string = 'assets/images/image1.png';
  userRole: string = 'Utilisateur';



  // Total count for percentage calculations
  totalChartCount: number = 0;

  @ViewChild('donutChart') donutChart!: ElementRef;

  constructor(
    private router: Router,
    private token: TokenStorageService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Charger les données de l'utilisateur connecté
    this.currentUser = this.token.getUser();
    // console.log(this.token.getUser());
    // S'assurer que "Accueil" est sélectionné par défaut
    this.selectedMenu = 'Accueil';
    this.activeView = 'Accueil';
    this.showAccueil = true; // Afficher l'accueil par défaut
    
    this.loadUserDashboard();
    this.checkScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  // Méthode pour actualiser l'affichage des composants en fonction des sélections
  updateComponentDisplay(): void {
    // Réinitialiser tous les composants
    this.showImages = false;
    this.showVideos = false;
    this.showPictos = false;
    this.showDocuments = false;
    this.showUsers = false;
    this.showRoles = false;
    this.showAdmins = false; // Réinitialiser aussi la variable showAdmins

    this.showCampagnes = false;
    this.showSocialMedia = false;
    this.showPlv = false;
    this.showMobile = false;

    this.showProfiles = false;

    this.showAccueil = false;
    // Mettre à jour l'affichage en fonction de la vue active

    switch (this.activeView) {
      case 'Accueil':
        this.showAccueil = true;
        break;
      case 'Images':
        this.showImages = true;
        break;
      case 'Vidéos':
        this.showVideos = true;
        break;
      case 'Pictos':
        this.showPictos = true;
        break;
      case 'Documents':
        this.showDocuments = true;
        break;

      case 'PLV':
        this.showPlv = true;
        break;
      case 'Mobile':
        this.showMobile = true;
        break;
      case 'SM':
        this.showSocialMedia = true;
        break;
      case 'Campagnes':
        this.showCampagnes = true;
        break;

      case 'Utilisateurs':
        this.showUsers = true;
        break;
      case 'Administrateurs': // Correction de l'orthographe
        this.showAdmins = true;
        break;
        
      case 'Roles':
        this.showRoles = true;
        break;
      
      case 'Profiles': // Ajoutez ce cas
        this.showProfiles = true;
        break;
      default:
        this.showAccueil = true;
    }
  }
  
  openUserDashboard() {
    this.activeView = 'Profiles';
    this.updateComponentDisplay();
  }

  selectMenuItem(menu: string) {
    // Vérifier si on clique sur le même menu principal
    if (this.selectedMenu === menu) {
      // Si on clique sur le même menu (Librairie ou Gestion), on le désélectionne
      // pour masquer ses sous-menus
      if (menu === 'Librairie' || menu === 'Gestion') {
        this.previouslySelectedMenu = this.selectedMenu;
        this.selectedMenu = '';
        // Ne pas changer la vue active pour garder l'affichage du composant actuel
      } else if (menu === 'Accueil') {
        this.activeView = 'Accueil';
        this.showAccueil = true;
      }
    } else {
      // Sauvegarde de la sélection précédente et mise à jour du menu sélectionné
      this.previouslySelectedMenu = this.selectedMenu;
      this.selectedMenu = menu;
      
      // Traitement direct pour les éléments spécifiques
      if (menu === 'Images' || menu === 'Vidéos' || menu === 'Pictos' || menu === 'Documents' || menu === 'Utilisateurs' || menu === 'Roles') {
        this.activeView = menu; // Mettre à jour la vue active
      } else if (menu === 'Accueil') {
        this.activeView = 'Accueil';
      }
    }
    
    this.updateComponentDisplay();
    
    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  selectLibraryItem(item: string) {
    // Vérifier si on clique sur un élément déjà sélectionné
    if (this.selectedLibraryItem === item) {
      // Si on clique sur le même élément, on le désélectionne pour masquer ses sous-éléments
      // sauf pour le cas spécial de Web qui a son propre comportement
      if (item === 'Web') {
        // Si Web est déjà sélectionné, on alterne entre affichage et masquage de ses sous-options
        this.selectedWebItem = this.selectedWebItem ? '' : 'Images';
        if (this.selectedWebItem) {
          this.activeView = this.selectedWebItem;
        }
      } else {
        // Pour les autres éléments, on les désélectionne simplement
        this.selectedLibraryItem = '';
        // Ne pas changer la vue active pour garder l'affichage du composant actuel
      }
    } else {
      // Si on sélectionne un nouvel élément
      this.selectedLibraryItem = item;

      // Cas particulier pour les éléments Web
      if (item === 'Web') {
        this.selectedWebItem = 'Images';
        this.activeView = 'Images';
      } else if (item === 'Utilisateurs') {
        this.activeView = 'Utilisateurs';
      } else if (item === 'Administrateur') { // Correction ici pour le menu Administrateur
        this.activeView = 'Administrateurs';  // Qui devrait afficher la vue 'Administrateurs'
      } else if (item === 'Roles') {
        this.activeView = 'Roles';
      } else if (item === 'Mobile') {
        this.activeView = 'Mobile';
      } else if (item === 'SM') {
        this.activeView = 'SM';
      } else if (item === 'PLV') {
        this.activeView = 'PLV';
      } else if (item === 'Campagnes') {
        this.activeView = 'Campagnes';
      }
    }
    
    this.updateComponentDisplay();

    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  selectWebItem(item: string) {
    this.selectedWebItem = item;
    this.activeView = item; // Mettre à jour la vue active avec l'élément Web sélectionné
    this.updateComponentDisplay();

    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  ngAfterViewInit(): void {
    // Draw the donut chart after the view is initialized
    this.renderDonutChart();
  }

  loadUserDashboard(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserDashboard().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.username = this.userDetails.username;
        this.userRole = this.userDetails.roles[0].name;

        // Déterminer si l'utilisateur est admin ou super admin
        this.checkUserRole();

        // Charger les données du dashboard depuis la BDD
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error loading user Dashboard:', err);
        this.message = err.error?.message || 'Erreur lors du chargement du profil utilisateur';
      }
    });
  }

  checkUserRole(): void {
    // Vérifier les rôles de l'utilisateur
    if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');
      this.isSuperAdmin = this.currentUser.roles.includes('ROLE_SUPER');

      // Si l'utilisateur est admin/super admin et qu'il sélectionne la gestion
      if ((this.isAdmin || this.isSuperAdmin) && this.selectedMenu === 'Gestion') {
        if ((this.selectedLibraryItem === 'Utilisateurs' && this.isAdmin) || (this.selectedLibraryItem === 'Administrateur' && this.isSuperAdmin)) {
        }
      }
      this.updateComponentDisplay();
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.isUpdateSuccess = false;
    this.isUpdateFailed = false;
  }

  onSubmit(): void {
    this.userService.updateUserDashboard(this.userDetails).subscribe({
      next: (response) => {
        this.isUpdateSuccess = true;
        this.isUpdateFailed = false;
        this.message = response.message;
        this.isEditing = false;
        this.loadUserDashboard();
      },
      error: (err) => {
        this.isUpdateFailed = true;
        this.isUpdateSuccess = false;
        this.message = err.error.message;
      }
    });
  }
  
  toggleMobileMenu() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  // Méthode pour basculer l'état du collapse du sidebar
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  checkScreenSize() {
    // Add responsive behavior for the menu
    if (window.innerWidth >= 992) {
      this.isMobileOpen = true; // Always visible on large screens
    } else {
      this.isMobileOpen = false; // Hidden by default on small screens
    }
  }

  getDonutSegment(count: number, index: number): string {
    const percentage = (count / this.totalChartCount) * 100;
    return `${percentage} ${100 - percentage}`;
  }

  // Render the donut chart with SVG
  renderDonutChart() {
    if (!this.donutChart) return;

    // SVG setup could be done here if needed for more complex charts
  }

  // Methods for content tabs
  selectContentTab(tab: string) {
    // Logic to switch between content tabs
    console.log('Selected content tab:', tab);
  }

  // Check if screen is mobile
  isMobile(): boolean {
    return window.innerWidth < 992;
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
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  closeMobileMenu(): void {
    this.isMobileOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.authService.logout().subscribe({
      next: () => {
        this.token.signOut();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
        // Même en cas d'erreur, on déconnecte l'utilisateur localement
        this.token.signOut();
        this.router.navigate(['/login']);
      }
    });
  }

  loadDashboardData(): void {
    // Cette méthode est appelée pour charger les données du dashboard
    // Implémentez ici la logique pour charger les données réelles de votre application
    console.log('Loading dashboard data...');
  }
}