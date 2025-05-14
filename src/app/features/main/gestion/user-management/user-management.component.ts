import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedUsers: any[] = []; // Users displayed on current page
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
  
  // Filtres
  searchTerm = '';
  selectedRoleFilter = 'all';
  selectedStatusFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 15; // Changed to 15 as requested
  totalPages = 1;

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.checkRoles();
    this.loadUsers();
  }

  // Vérifier les rôles de l'utilisateur connecté
  checkRoles(): void {
    if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.includes('ROLE_ADMIN');
      this.isSuperAdmin = this.currentUser.roles.includes('ROLE_SUPER');
    }
  }

  // Charger les utilisateurs en fonction du rôle
  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    if (this.isSuperAdmin) {
      // Super admin peut voir tous les utilisateurs et les admins
      this.userService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.filterUsers();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs: ' + err.message;
          this.loading = false;
        }
      });
    } else if (this.isAdmin) {
      // Admin ne peut voir que les utilisateurs réguliers
      this.userService.getAllRegularUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.filterUsers();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  // Filtrer les utilisateurs selon les critères
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      // Filtre de recherche
      const searchMatch = !this.searchTerm || 
                         user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filtre de rôle
      let roleMatch = true;
      if (this.selectedRoleFilter === 'users') {
        roleMatch = this.isUserRegular(user);
      } else if (this.selectedRoleFilter === 'admins') {
        roleMatch = this.isUserAdmin(user);
      } else if (this.selectedRoleFilter === 'super') {
        roleMatch = this.isUserSuperAdmin(user);
      }
      
      // Filtre de statut
      let statusMatch = true;
      if (this.selectedStatusFilter === 'active') {
        statusMatch = user.enabled === true;
      } else if (this.selectedStatusFilter === 'inactive') {
        statusMatch = user.enabled === false;
      }
      
      return searchMatch && roleMatch && statusMatch;
    });
    
    // Calculer le nombre total de pages
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    
    // Revenir à la première page après filtrage
    this.goToPage(1);
  }

  // Pagination - aller à une page spécifique
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    
    this.currentPage = page;
    
    // Calculer les indices de début et de fin pour la pagination
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredUsers.length);
    
    // Mettre à jour les utilisateurs affichés
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Pagination - aller à la page précédente
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Pagination - aller à la page suivante
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Changer le nombre d'éléments par page
  changeItemsPerPage(value: number): void {
    this.itemsPerPage = value;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.goToPage(1);
  }

  // Générer les numéros de page à afficher (pour éviter d'afficher un trop grand nombre de pages)
  getPageNumbers(): number[] {
    const pages = [];
    
    // Toujours afficher la première page, la page courante et la dernière page
    // avec au maximum 1 page avant et après la page courante
    if (this.totalPages <= 5) {
      // Moins de 5 pages, afficher toutes les pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Plus de 5 pages, afficher un sous-ensemble
      pages.push(1); // Première page
      
      if (this.currentPage > 2) pages.push(-1); // Ellipsis si nécessaire
      
      // Pages autour de la page courante
      if (this.currentPage > 1 && this.currentPage < this.totalPages) {
        if (this.currentPage > 2) pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        if (this.currentPage < this.totalPages - 1) pages.push(this.currentPage + 1);
      }
      
      if (this.currentPage < this.totalPages - 1) pages.push(-1); // Ellipsis si nécessaire
      
      pages.push(this.totalPages); // Dernière page
    }
    
    return pages;
  }

  // Obtenir l'affichage du rôle de l'utilisateur
  getUserRoleDisplay(user: any): string {
    if (this.isUserSuperAdmin(user)) {
      return 'Administrateur principal';
    } else if (this.isUserAdmin(user)) {
      return 'Administrateur secondaire';
    } else if (user.fonction && user.fonction.trim()) {
      return user.fonction;
    } else if (this.hasRole(user, 'ROLE_ARCHIVISTE')) {
      return 'Archiviste';
    } else if (this.hasRole(user, 'ROLE_CONTENT')) {
      return 'Responsable de contenu';  
    }
    return 'Utilisateur';
  }
  
  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(user: any, roleName: string): boolean {
    return user.roles && user.roles.some((role: any) => 
      role === roleName || role.name === roleName);
  }

  // Vérifier si l'utilisateur est un super admin
  isUserSuperAdmin(user: any): boolean {
    return this.hasRole(user, 'ROLE_SUPER');
  }

  // Vérifier si l'utilisateur est un admin
  isUserAdmin(user: any): boolean {
    return this.hasRole(user, 'ROLE_ADMIN') && !this.isUserSuperAdmin(user);
  }

  // Vérifier si l'utilisateur est un utilisateur régulier
  isUserRegular(user: any): boolean {
    return !this.isUserAdmin(user) && !this.isUserSuperAdmin(user);
  }

  // Vérifier si l'utilisateur courant peut éditer un autre utilisateur
  canEditUser(user: any): boolean {
    // Super admin peut éditer tout le monde sauf lui-même
    if (this.isSuperAdmin) {
      return this.currentUser.id !== user.id;
    }
    
    // Admin peut éditer uniquement les utilisateurs réguliers
    if (this.isAdmin) {
      return !this.isUserAdmin(user) && !this.isUserSuperAdmin(user);
    }
    
    return false;
  }

  // Vérifier si l'utilisateur courant peut supprimer un autre utilisateur
  canDeleteUser(user: any): boolean {
    // Mêmes règles que pour l'édition
    return this.canEditUser(user);
  }

  // Vérifier si l'utilisateur courant peut changer le rôle d'un autre utilisateur
  canChangeRole(user: any): boolean {
    // Seul le super admin peut changer les rôles
    return this.isSuperAdmin;
  }

  // Sélectionner un utilisateur pour édition
  selectUser(user: any): void {
    this.selectedUser = { ...user }; // Copier l'utilisateur pour éviter de modifier directement l'original
    this.determineSelectedUserRole();
    this.isEditing = true;
    this.isNewUser = false;
  }



  // Déterminer le rôle sélectionné de l'utilisateur pour le formulaire
  determineSelectedUserRole(): void {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      this.selectedUserRole = 'SUPER';
    } else if (this.isUserAdmin(this.selectedUser)) {
      this.selectedUserRole = 'ADMIN';
    } else {
      this.selectedUserRole = 'USER';
    }
  }

  // Annuler l'édition
  cancelEditing(): void {
    this.selectedUser = null;
    this.isEditing = false;
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

    // Si c'est un nouvel utilisateur, appeler la création
    if (!this.isNewUser) {
      // Mettre à jour un utilisateur existant
      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: (response) => {
          this.successMessage = 'Utilisateur mis à jour avec succès';
          this.loadUsers();
          this.isEditing = false;
          this.selectedUser = null;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    }
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.loading = true;
      this.errorMessage = '';
      
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.successMessage = 'Utilisateur supprimé avec succès';
          this.loadUsers();
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    }
  }
}