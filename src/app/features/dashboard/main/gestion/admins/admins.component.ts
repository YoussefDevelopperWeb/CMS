import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { UserService } from '../../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminsComponent implements OnInit {
  admins: any[] = [];
  filteredAdmins: any[] = [];
  displayedAdmins: any[] = []; // Admins affichés sur la page courante
  currentUser: any;
  isSuperAdmin = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedAdmin: any = null;
  isEditing = false;
  isNewAdmin = false;
  showAdminList = true; // Pour afficher/masquer la liste des administrateurs
  showEditForm = false; // Pour afficher/masquer le formulaire d'édition
  
  // Filtres de recherche
  searchTerm = '';
  selectedStatusFilter = 'all';
  emailFilter = '';
  fonctionFilter = '';
  showAdvancedFilters = false;
  
  private errorTimeoutId: any;
  private successTimeoutId: any;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10; // 10 admins par page comme pour les utilisateurs
  totalPages = 1;
  totalItems = 0;

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.checkRoles();
    this.loadAdmins();
  }

  // Vérifier les rôles de l'utilisateur courant
  checkRoles(): void {
    if (this.currentUser && this.currentUser.roles) {
      this.isSuperAdmin = this.currentUser.roles.includes('ROLE_SUPER');
      
      // Si l'utilisateur n'est pas un super administrateur, rediriger vers la page d'accueil
      if (!this.isSuperAdmin) {
        // Redirection logique ici si nécessaire
        console.error('Accès non autorisé: Super Admin requis');
      }
    }
  }

  // Charger tous les administrateurs avec pagination
  loadAdmins(): void {
    this.loading = true;
    
    // Construire les filtres
    const filterParams = {
      searchTerm: this.searchTerm,
      statusFilter: this.selectedStatusFilter,
      email: this.emailFilter,
      fonction: this.fonctionFilter,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage
    };
    
    this.userService.filterAdmins(filterParams).subscribe({
      next: (data) => {
        // Vérifier si data est un objet PaginatedResponse
        if (data && data.content && Array.isArray(data.content)) {
          this.admins = data.content;
          this.filteredAdmins = this.admins;
          this.displayedAdmins = this.filteredAdmins;
          this.totalItems = data.totalItems;
          this.totalPages = data.totalPages;
        } else {
          console.error('Format de données inattendu:', data);
          this.admins = [];
          this.filteredAdmins = [];
          this.displayedAdmins = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.setErrorMessage('Erreur lors du chargement des administrateurs: ' + err.message);
        this.loading = false;
      }
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.currentPage = 1; // Retourner à la première page
    this.loadAdmins(); // Charger avec les nouveaux filtres
  }
  
  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatusFilter = 'all';
    this.emailFilter = '';
    this.fonctionFilter = '';
    this.showAdvancedFilters = false;
    this.currentPage = 1; // Retourner à la première page
    this.loadAdmins(); // Recharger avec les filtres réinitialisés
  }
  
  // Mettre à jour le statut d'un administrateur (toggle on/off)
  updateAdminStatus(admin: any): void {
    const statusData = {
      enabled: admin.enabled
    };
    
    this.userService.updateUserStatus(admin.id, statusData).subscribe({
      next: () => {
        this.setSuccessMessage(`Le statut de ${admin.username} a été mis à jour avec succès`);
      },
      error: (err) => {
        // Rétablir l'état précédent en cas d'erreur
        admin.enabled = !admin.enabled;
        this.setErrorMessage('Erreur lors de la mise à jour du statut: ' + err.message);
      }
    });
  }
  
  // Pagination
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAdmins();
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAdmins();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdmins();
    }
  }
  
  // Gestion des administrateurs
  selectAdmin(admin: any): void {
    this.isNewAdmin = false;
    this.selectedAdmin = { ...admin }; // Copie pour éviter la modification directe
    this.showEditForm = true;
    this.showAdminList = false;
  }

  // Annuler l'édition
  cancelEditing(): void {
    this.selectedAdmin = null;
    this.showEditForm = false;
    this.showAdminList = true;
    this.errorMessage = '';
  }

  // Mettre à jour un administrateur
  updateAdmin(): void {
    if (!this.selectedAdmin) return;

    this.loading = true;
    this.errorMessage = '';

    // Préparer les données pour la mise à jour
    const adminData = {
      ...this.selectedAdmin,
      role: this.selectedAdmin.role || 'ADMIN' // Conserver le rôle existant ou définir ADMIN par défaut
    };
    
    this.userService.updateUser(this.selectedAdmin.id, adminData).subscribe({
      next: () => {
        this.setSuccessMessage('Administrateur mis à jour avec succès');
        this.loadAdmins();
        this.showEditForm = false;
        this.showAdminList = true;
        this.selectedAdmin = null;
        this.loading = false;
      },
      error: (err) => {
        this.setErrorMessage('Erreur lors de la mise à jour: ' + (err.error?.message || err.message));
        this.loading = false;
      }
    });
  }
  
  // Supprimer un administrateur
  deleteAdmin(adminId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      this.loading = true;
      this.userService.deleteUser(adminId).subscribe({
        next: () => {
          this.setSuccessMessage('Administrateur supprimé avec succès');
          this.loadAdmins();
          this.loading = false;
        },
        error: (err) => {
          this.setErrorMessage('Erreur lors de la suppression: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const visiblePages = 5; // Nombre de pages visibles
    
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
  
  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1; // Revenir à la première page
    this.loadAdmins();
  }

  // Vérifier si l'utilisateur courant peut éditer un administrateur
  canEditAdmin(admin: any): boolean {
    // Super admin peut éditer tous les admins sauf lui-même
    if (this.isSuperAdmin) {
      return this.currentUser.id !== admin.id;
    }
    return false;
  }

  // Vérifier si l'utilisateur courant peut supprimer un administrateur
  canDeleteAdmin(admin: any): boolean {
    // Même logique que pour l'édition
    return this.canEditAdmin(admin);
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