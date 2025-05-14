import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

export class HomeContentComponent implements OnInit {
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
  previouslySelectedMenu: string = '';
  selectedLibraryItem: string = '';
  selectedWebItem: string = '';

  // Variable pour le rôle de l'utilisateur
  isAdmin: boolean = false;
  usersList: any[] = [];

  // Propriétés pour le menu sidebar
  isCollapsed: boolean = false;
  isMobileOpen: boolean = false;

  userRole: string = 'Utilisateur';

  // Données pour les cartes en haut
  cardData = {
    images: { count:22, label: 'Nouvelles images' },
    videos: { count: 67, label: 'Nouvelles vidéos' },
    picto: { count: 193, label: 'Nouveau picto' },
    documents: { count: 271, label: 'Nouveaux documents' }
  };

  // Données pour le graphique circulaire
  chartData = [
    { status: 'Planifié', count: 56, color: '#b691f9' },
    { status: 'Publié', count: 23, color: '#89e0a9' },
    { status: 'En attente', count: 2, color: '#ffdd85' },
    { status: 'Non publié', count: 99, color: '#ffc49e' },
    { status: 'Archivé', count: 187, color: '#dcdce8' },
    { status: 'Erreur de publication', count: 44, color: '#ffa1a1' }
  ];

  // Total count for percentage calculations
  totalChartCount: number = 0;

  constructor(
    private router: Router,
    private token: TokenStorageService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Charger les données de l'utilisateur connecté
    this.currentUser = this.token.getUser();
    this.loadUserDashboard();
    this.calculateTotalCount();
    this.checkScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  loadUserDashboard(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserDashboard().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.username = this.userDetails.username || 'Utilisateur';
        this.userRole = this.userDetails.role || 'Utilisateur';

        // Déterminer si l'utilisateur est un admin
        this.checkUserRole();
      },
      error: (err) => {
        console.error('Error loading user Dashboard:', err);
        this.message = err.error?.message || 'Erreur lors du chargement du profil utilisateur';
      }
    });
  }

  checkUserRole(): void {
    // Vérifier si l'utilisateur a le rôle admin
    if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');

      // Si l'utilisateur est admin et qu'il sélectionne la gestion des utilisateurs
      if (this.isAdmin && this.selectedMenu === 'Gestion' && this.selectedLibraryItem === 'Utilisateurs') {
        this.loadAllUsers();
      }
    }
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.usersList = data;
      },
      error: (err) => {
        console.error('Error loading users list:', err);
      }
    });
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

  selectMenuItem(menu: string) {
    // Si on clique sur le menu déjà sélectionné, on le désélectionne
    if (this.selectedMenu === menu) {
      this.previouslySelectedMenu = this.selectedMenu;
      this.selectedMenu = '';
      this.selectedLibraryItem = '';
    } else {
      this.previouslySelectedMenu = this.selectedMenu;
      this.selectedMenu = menu;
      
      // Réinitialiser les sélections des sous-menus
      if (menu !== 'Librairie' && menu !== 'Gestion') {
        this.selectedLibraryItem = '';
      }
    }

    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  selectLibraryItem(item: string) {
    // Si on clique sur l'élément déjà sélectionné, on le désélectionne
    if (this.selectedLibraryItem === item) {
      this.selectedLibraryItem = '';
      this.selectedWebItem = '';
    } else {
      this.selectedLibraryItem = item;

      // Si on est dans le menu Gestion et que l'élément sélectionné est Utilisateurs
      if (this.selectedMenu === 'Gestion' && item === 'Utilisateurs' && this.isAdmin) {
        this.loadAllUsers();
      }

      // Reset web item selection when changing library items
      if (item !== 'Web') {
        this.selectedWebItem = '';
      } else if (this.selectedWebItem === '') {
        // Set default web item if none is selected
        this.selectedWebItem = 'Images';
      }
    }

    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  selectWebItem(item: string) {
    this.selectedWebItem = item;

    // Close mobile menu after selection on small screens
    if (window.innerWidth < 992) {
      this.isMobileOpen = false;
    }
  }

  openUserDashboard() {
    this.toggleEdit();
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

  calculateTotalCount() {
    this.totalChartCount = this.chartData.reduce((sum, item) => sum + item.count, 0);
  }

  getDonutSegment(count: number, index: number): string {
    const percentage = (count / this.totalChartCount) * 100;
    return `${percentage} ${100 - percentage}`;
  }

  getDonutOffset(index: number): number {
    // Calculate the offset based on previous segments
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.chartData[i].count / this.totalChartCount) * 100;
    }
    return -offset;
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
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
        // Même en cas d'erreur, on déconnecte l'utilisateur localement
        this.token.signOut();
        this.router.navigate(['/login']);
      }
    });
  }
}