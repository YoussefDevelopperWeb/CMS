import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { UserService } from '../../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../../../dashboard.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,DashboardComponent]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedUsers: any[] = []; // Les utilisateurs affichés sur la page courante
  availableRoles: {value: string, label: string}[] = [];

  currentUser: any;
  isAdmin = false;
  isSuperAdmin = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedUser: any = null;
  selectedUserRole = 'USER';
  isEditing = false;
  isNewUser = false;
  showUserList = true; // Pour afficher/masquer la liste des utilisateurs
  showEditForm = false; // Pour afficher/masquer le formulaire d'édition
  
  // Filtres de recherche
  searchTerm = '';
  selectedRoleFilter = 'all';
  selectedStatusFilter = 'all';
  emailFilter = '';
  fonctionFilter = '';
  showAdvancedFilters = false;
  
  // Gestionnaire de timeout pour les messages
  private errorTimeoutId: any;
  private successTimeoutId: any;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10; // Fixé à 10 utilisateurs par page

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.checkRoles();
    this.loadRoles();
    this.loadUsers();
  }

  // Vérifier les rôles de l'utilisateur courant
  checkRoles(): void {
    if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');
      this.isSuperAdmin = this.currentUser.roles.includes('ROLE_SUPER');
    }
  }
loadRoles(): void {
    // Définir les rôles de base
    this.availableRoles = [
      { value: 'USER', label: 'Utilisateur' },
      { value: 'RESPO', label: 'Responsable' },
      { value: 'ARCH', label: 'Architecte' }
    ];
    
    // Si l'utilisateur est super admin, ajouter les rôles admin et super
    if (this.isSuperAdmin) {
      this.availableRoles.push({ value: 'ADMIN', label: 'Administrateur secondaire' });
      this.availableRoles.push({ value: 'SUPER', label: 'Administrateur principal' });
    }
  }
  // Charger les utilisateurs avec pagination côté serveur
  loadUsers(): void {
    this.loading = true;
    this.applyFilters();
  }

  // Appliquer les filtres et récupérer la page actuelle d'utilisateurs
  applyFilters(): void {
    this.loading = true;
    
    // Construire l'objet de filtre
    const filterParams = {
      searchTerm: this.searchTerm.trim(),
      email: this.emailFilter.trim(),
      fonction: this.fonctionFilter.trim(),
      
      usernameMode: this.searchTerm.trim() ? 'active' : '',
      emailMode: this.emailFilter.trim() ? 'active' : '',
      fonctionMode: this.fonctionFilter.trim() ? 'active' : '',
      
      roleFilter: this.selectedRoleFilter,
      statusFilter: this.selectedStatusFilter,
      
      page: this.currentPage,
      itemsPerPage: 10 // Fixé à 10 utilisateurs par page
    };
    
    this.userService.filterUsers(filterParams).subscribe({
      next: (response) => {
        // Mise à jour des données de pagination et des utilisateurs
        this.displayedUsers = response.content;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error: (err) => {
        this.setErrorMessage('Erreur lors du chargement des utilisateurs: ' + err.message);
        this.loading = false;
      }
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRoleFilter = 'all';
    this.selectedStatusFilter = 'all';
    this.emailFilter = '';
    this.fonctionFilter = '';
    this.showAdvancedFilters = false;
    this.currentPage = 1; // Revenir à la première page
    this.applyFilters();
  }
  
  // Navigation vers la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }
  
  // Navigation vers la page précédente
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }
  
  // Aller à une page spécifique
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }
  
  // Générer les numéros de page à afficher
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const visiblePages = 5; // Nombre de pages visibles dans la pagination
    
    if (this.totalPages <= visiblePages) {
      // Afficher toutes les pages si moins que le nombre visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);
      
      // Calculer les pages intermédiaires
      const startPage = Math.max(2, this.currentPage - Math.floor(visiblePages / 2));
      const endPage = Math.min(this.totalPages - 1, startPage + visiblePages - 3);
      
      // Ajouter des points de suspension si nécessaire
      if (startPage > 2) {
        pages.push(-1); // Point de suspension
      }
      
      // Ajouter les pages intermédiaires
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Ajouter des points de suspension si nécessaire
      if (endPage < this.totalPages - 1) {
        pages.push(-1); // Point de suspension
      }
      
      // Toujours afficher la dernière page
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  // Sélectionner un utilisateur pour modification
  selectUser(user: any): void {
    this.isNewUser = false;
    this.selectedUser = { ...user }; // Copie pour éviter la modification directe
    
    // Déterminer le rôle de l'utilisateur
    if (this.isUserSuperAdmin(user)) {
      this.selectedUserRole = 'SUPER';
    } else if (this.isUserAdmin(user)) {
      this.selectedUserRole = 'ADMIN';
    } else if (this.isUserArch(user)) {
      this.selectedUserRole = 'ARCH';
    } else if (this.isUserRespo(user)) {
      this.selectedUserRole = 'RESPO';
    } else {
      this.selectedUserRole = 'USER';
    }
    
    this.showEditForm = true;
    this.showUserList = false;
  }

  // Annuler l'édition
  cancelEditing(): void {
    this.selectedUser = null;
    this.showEditForm = false;
    this.showUserList = true;
    this.errorMessage = '';
  }

  // Mettre à jour un utilisateur
  updateUser(): void {
    if (!this.selectedUser) return;

    this.loading = true;
    this.errorMessage = '';

    // Préparer les données pour la mise à jour
    const userData = {
      ...this.selectedUser,
      role: this.selectedUserRole
    };
    
    if (!this.isNewUser) {
      // Mettre à jour un utilisateur existant
      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: (response) => {
          this.setSuccessMessage('Utilisateur mis à jour avec succès');
          this.showEditForm = false;
          this.showUserList = true;
          this.selectedUser = null;
          this.loading = false;
          this.loadUsers(); // Recharger la liste
        },
        error: (err) => {
          this.setErrorMessage('Erreur lors de la mise à jour: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.loading = true;
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.setSuccessMessage('Utilisateur supprimé avec succès');
          this.loading = false;
          this.loadUsers(); // Recharger la liste
        },
        error: (err) => {
          this.setErrorMessage('Erreur lors de la suppression: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  // Vérifier si l'utilisateur est administrateur
  isUserAdmin(user: any): boolean {
    if (!user.roles) return false;
    
    // Vérifier si les rôles sont un tableau d'objets ou un tableau de chaînes
    if (typeof user.roles[0] === 'string') {
      return user.roles.includes('ROLE_ADMIN');
    } else {
      return user.roles.some((role: any) => role.name === 'ROLE_ADMIN');
    }
  }

  // Vérifier si l'utilisateur est super administrateur
  isUserSuperAdmin(user: any): boolean {
    if (!user.roles) return false;
    
    if (typeof user.roles[0] === 'string') {
      return user.roles.includes('ROLE_SUPER');
    } else {
      return user.roles.some((role: any) => role.name === 'ROLE_SUPER');
    }
  }
updateUserStatus(user: any): void {
  // Créer un objet avec seulement les données nécessaires
  const userData = {
    id: user.id,
    enabled: user.enabled
  };
  
  // Appeler l'API pour mettre à jour l'état
  this.loading = true;
  
  this.userService.updateUserStatus(user.id, userData).subscribe({
    next: (response) => {
      this.setSuccessMessage('Statut de l\'utilisateur mis à jour avec succès');
      this.loading = false;
    },
    error: (err) => {
      // En cas d'erreur, revenir à l'état précédent
      user.enabled = !user.enabled;
      this.setErrorMessage('Erreur lors de la mise à jour du statut: ' + (err.error?.message || err.message));
      this.loading = false;
    }
  });
}
  // Vérifier si l'utilisateur est architecte
  isUserArch(user: any): boolean {
    if (!user.roles) return false;
    
    if (typeof user.roles[0] === 'string') {
      return user.roles.includes('ROLE_ARCH');
    } else {
      return user.roles.some((role: any) => role.name === 'ROLE_ARCH');
    }
  }

  // Vérifier si l'utilisateur est responsable
  isUserRespo(user: any): boolean {
    if (!user.roles) return false;
    
    if (typeof user.roles[0] === 'string') {
      return user.roles.includes('ROLE_RESPO');
    } else {
      return user.roles.some((role: any) => role.name === 'ROLE_RESPO');
    }
  }

  // Vérifier si l'utilisateur est régulier (aucun rôle spécial)
  isUserRegular(user: any): boolean {
    return !this.isUserAdmin(user) && !this.isUserSuperAdmin(user) && 
           !this.isUserArch(user) && !this.isUserRespo(user);
  }

  // Vérifier si l'utilisateur courant peut éditer un autre utilisateur
  canEditUser(user: any): boolean {
    // Super admin peut éditer tout le monde sauf lui-même
    if (this.isSuperAdmin) {
      return this.currentUser.id !== user.id;
    }
    
    // Admin peut éditer uniquement les utilisateurs réguliers
    if (this.isAdmin) {
      return !this.isUserAdmin(user) && !this.isUserSuperAdmin(user) ;
    }
    
    return false;
  }

  // Vérifier si l'utilisateur courant peut supprimer un autre utilisateur
  canDeleteUser(user: any): boolean {
    return this.canEditUser(user);
  }

  // Vérifier si l'utilisateur courant peut changer le rôle d'un autre utilisateur
  canChangeRole(user: any): boolean {
    return this.isSuperAdmin || (this.isAdmin && this.isUserRegular(user));
  }

  // Obtenir l'affichage du rôle de l'utilisateur
  getUserRoleDisplay(user: any): string {
    if (this.isUserSuperAdmin(user)) {
      return 'Administrateur principal';
    } else if (this.isUserAdmin(user)) {
      return 'Administrateur secondaire';
    } else if (this.isUserArch(user)) {
      return 'Architecte';
    } else if (this.isUserRespo(user)) {
      return 'Responsable';
    } else {
      return 'Utilisateur';
    }
  }

  // Afficher ou masquer les filtres avancés
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Gérer les messages d'erreur avec timeout
  setErrorMessage(message: string): void {
    if (this.errorTimeoutId) {
      clearTimeout(this.errorTimeoutId);
    }
    this.errorMessage = message;
    this.errorTimeoutId = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  // Gérer les messages de succès avec timeout
  setSuccessMessage(message: string): void {
    if (this.successTimeoutId) {
      clearTimeout(this.successTimeoutId);
    }
    this.successMessage = message;
    this.successTimeoutId = setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }
}