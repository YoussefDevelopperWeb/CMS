import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleService } from '../../../../../core/services/role.service';
import { PrivilegeService } from '../../../../../core/services/privilege.service';

export interface Role {
  id?: number;
  name: string;
  description?: string;
}

export interface Privilege {
  id?: number;
  name: string;
  category: string;
  subcategory?: string;
  subcategory2?: string;
  selected: boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class RolesComponent implements OnInit {
  // Propriétés pour la gestion des rôles
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  roleForm: FormGroup;
  isEditing = false;
  showModal = false;
  confirmDeleteModal = false;
  roleToDelete: Role | null = null;
  activeTab = 'library'; // 'library' ou 'management'
  
  // Propriétés pour la pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Propriétés pour les filtres
  roleFilter = 'all';
  
  // Propriétés pour les messages et le chargement
  message = '';
  isError = false;
  isLoading = false;

  // Propriétés pour les privilèges
  privileges: Privilege[] = [];
  filteredLibraryPrivileges: { [key: string]: Privilege[] } = {};
  filteredManagementPrivileges: { [key: string]: Privilege[] } = {};
  
  // Propriétés pour les états de visibilité des catégories
  visibleCategories: { [key: string]: boolean } = {};
  visibleSubcategories: { [key: string]: boolean } = {};
  
  categoryMap = {
    'library': 'Tous les privilèges librairie',
    'management': 'Tous les privilèges de gestion'
  };
  
  libraryCategories = ['web', 'mobile', 'campagnes', 'plv', 'social'];
  webSubcategories = ['images', 'videos', 'pictos', 'documents'];
  
  constructor(
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [''],
      active: [true] // État actif par défaut
    });
    
    // Initialiser les privilèges
    this.initializePrivileges();
    
    // Initialiser les états de visibilité
    this.initializeVisibilityStates();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadAllPrivileges();
    this.prepareFilteredPrivileges();
  }
  
  initializeVisibilityStates(): void {
    // Initialiser les états de visibilité des catégories
    this.libraryCategories.forEach(category => {
      this.visibleCategories[category] = category === 'web'; // 'web' est visible par défaut
    });
    
    // Ajouter les catégories de gestion
    this.visibleCategories['utilisateurs'] = false;
    this.visibleCategories['roles'] = false;
    
    // Initialiser les états de visibilité des sous-catégories web
    this.webSubcategories.forEach(subcategory => {
      this.visibleSubcategories[`web-${subcategory}`] = subcategory === 'images'; // 'images' est visible par défaut
    });
  }
  
  // Toggle visibility of a category
  toggleCategoryVisibility(category: string): void {
    this.visibleCategories[category] = !this.visibleCategories[category];
  }
  
  // Toggle visibility of a subcategory
  toggleSubcategoryVisibility(subcategoryKey: string): void {
    this.visibleSubcategories[subcategoryKey] = !this.visibleSubcategories[subcategoryKey];
  }

  // Get filtered privileges by subcategory and subcategory2
  getFilteredPrivileges(subcategory: string, subcategory2: string): Privilege[] {
    return this.privileges.filter(
      p => p.category === 'library' && 
           p.subcategory === subcategory && 
           p.subcategory2 === subcategory2
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  initializePrivileges(): void {
    // Initialisation des privilèges de la librairie Web - Images
    const webImagesPrivileges = [
      { name: 'Importer un fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Modifier les informations du fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Dupliquer un fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Télécharger un fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Copier le lien du fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Partager par e-mail le fichier', category: 'library', subcategory: 'web', subcategory2: 'images' },
      { name: 'Supprimer un fichier', category: 'library', subcategory: 'web', subcategory2: 'images' }
    ];

    // Les mêmes privilèges pour les autres sous-catégories web
    const webVideosPrivileges = webImagesPrivileges.map(p => ({...p, subcategory2: 'videos'}));
    const webPictosPrivileges = webImagesPrivileges.map(p => ({...p, subcategory2: 'pictos'}));
    const webDocumentsPrivileges = webImagesPrivileges.map(p => ({...p, subcategory2: 'documents'}));
    
    // Privilèges mobiles
    const mobilePrivileges = [
      { name: 'Importer une application mobile', category: 'library', subcategory: 'mobile' },
      { name: 'Modifier une application mobile', category: 'library', subcategory: 'mobile' },
      { name: 'Supprimer une application', category: 'library', subcategory: 'mobile' }
    ];

    // Privilèges social media
    const socialPrivileges = [
      { name: 'Créer une publication', category: 'library', subcategory: 'social' },
      { name: 'Modifier une publication', category: 'library', subcategory: 'social' },
      { name: 'Supprimer une publication', category: 'library', subcategory: 'social' }
    ];

    // Privilèges PLV
    const plvPrivileges = [
      { name: 'Créer un support PLV', category: 'library', subcategory: 'plv' },
      { name: 'Modifier un support PLV', category: 'library', subcategory: 'plv' },
      { name: 'Supprimer un support PLV', category: 'library', subcategory: 'plv' }
    ];

    // Privilèges campagnes
    const campagnesPrivileges = [
      { name: 'Créer une campagne', category: 'library', subcategory: 'campagnes' },
      { name: 'Modifier une campagne', category: 'library', subcategory: 'campagnes' },
      { name: 'Supprimer une campagne', category: 'library', subcategory: 'campagnes' },
      { name: 'Publier une campagne', category: 'library', subcategory: 'campagnes' }
    ];
    
    // Privilèges de gestion utilisateurs
    const managementUserPrivileges = [
      { name: 'Modifier le profil', category: 'management', subcategory: 'utilisateurs' },
      { name: 'Supprimer un utilisateur', category: 'management', subcategory: 'utilisateurs' },
      { name: 'Créer un utilisateur', category: 'management', subcategory: 'utilisateurs' },
      { name: 'Modifier les permissions d\'un utilisateur', category: 'management', subcategory: 'utilisateurs' }
    ];
    
    // Privilèges de gestion des rôles
    const managementRolePrivileges = [
      { name: 'Ajouter un nouveau rôle', category: 'management', subcategory: 'roles' },
      { name: 'Modifier un rôle', category: 'management', subcategory: 'roles' },
      { name: 'Supprimer un rôle', category: 'management', subcategory: 'roles' }
    ];

    // Combiner tous les privilèges
    this.privileges = [
      ...webImagesPrivileges.map(p => ({...p, selected: false})),
      ...webVideosPrivileges.map(p => ({...p, selected: false})),
      ...webPictosPrivileges.map(p => ({...p, selected: false})),
      ...webDocumentsPrivileges.map(p => ({...p, selected: false})),
      ...mobilePrivileges.map(p => ({...p, selected: false})),
      ...socialPrivileges.map(p => ({...p, selected: false})),
      ...plvPrivileges.map(p => ({...p, selected: false})),
      ...campagnesPrivileges.map(p => ({...p, selected: false})),
      ...managementUserPrivileges.map(p => ({...p, selected: false})),
      ...managementRolePrivileges.map(p => ({...p, selected: false}))
    ];
  }

  loadAllPrivileges(): void {
    this.privilegeService.getAllPrivileges().subscribe({
      next: (privileges: any[]) => {
        // Si des privilèges sont déjà définis dans la base de données,
        // mettre à jour notre liste locale avec les IDs correspondants
        privileges.forEach((dbPrivilege: any) => {
          const matchingPriv = this.privileges.find(
            p => p.name === dbPrivilege.name && 
                 p.category === dbPrivilege.category && 
                 p.subcategory === dbPrivilege.subcategory
          );
          if (matchingPriv) {
            matchingPriv.id = dbPrivilege.id;
          }
        });
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des privilèges', err);
      }
    });
  }

  prepareFilteredPrivileges(): void {
    // Préparation des privilèges filtrés pour éviter les appels répétés de filter() dans le template
    this.libraryCategories.forEach(subcat => {
      this.filteredLibraryPrivileges[subcat] = this.privileges.filter(
        p => p.category === 'library' && p.subcategory === subcat
      );
    });
    
    // Pour les privilèges de gestion
    const managementSubcategories = ['utilisateurs', 'roles'];
    managementSubcategories.forEach(subcat => {
      this.filteredManagementPrivileges[subcat] = this.privileges.filter(
        p => p.category === 'management' && p.subcategory === subcat
      );
    });
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getAllRoles().subscribe({
      next: (data: any) => {
        this.roles = data.content || data;
        this.filteredRoles = [...this.roles];
        this.totalItems = data.totalElements || this.roles.length;
        this.totalPages = data.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.message = 'Erreur lors du chargement des rôles.';
        this.isError = true;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterRoles(): void {
    let filtered = [...this.roles];
    
    // Filtre par nom de rôle
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(role => role.name === this.roleFilter);
    }
    
    this.filteredRoles = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Revenir à la première page après le filtrage
  }

  openAddModal(): void {
    this.isEditing = false;
    this.roleForm.reset({active: true}); // Reset avec l'état actif par défaut
    this.resetPrivileges();
    this.showModal = true;
  }

  openEditModal(role: Role): void {
    this.isEditing = true;
    this.roleForm.patchValue({
      name: role.name,
      description: role.description || '',
      active: true // Par défaut, tous les rôles sont actifs
    });
    
    // Charger les privilèges du rôle sélectionné
    this.loadRolePrivileges(role.id);
    this.showModal = true;
  }

  loadRolePrivileges(roleId?: number): void {
    if (!roleId) return;
    
    // Reset tous les privilèges
    this.resetPrivileges();
    
    // Charger les privilèges du rôle depuis le service
    this.roleService.getRolePrivileges(roleId).subscribe({
      next: (response: any) => {
        // Marquer les privilèges qui sont associés à ce rôle comme sélectionnés
        const rolePrivileges = response.privileges || [];
        rolePrivileges.forEach((rolePriv: any) => {
          if (rolePriv.statut) { // Vérifier si le privilège est actif
            const privilegeId = rolePriv.privilege?.id;
            if (privilegeId) {
              const matchingPriv = this.privileges.find(p => p.id === privilegeId);
              if (matchingPriv) {
                matchingPriv.selected = true;
              }
            }
          }
        });
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des privilèges du rôle', err);
        this.message = 'Erreur lors du chargement des privilèges du rôle.';
        this.isError = true;
      }
    });
  }

  resetPrivileges(): void {
    this.privileges.forEach(priv => priv.selected = false);
  }

  closeModal(): void {
    this.showModal = false;
    this.message = '';
  }

  saveRole(): void {
    if (this.roleForm.invalid) return;
    
    const roleData: Role = {
      name: this.roleForm.value.name,
      description: this.roleForm.value.description
      // L'état actif est géré séparément par l'API
    };
    
    this.isLoading = true;
    
    if (this.isEditing) {
      // Récupérer l'ID du rôle édité depuis le rôle sélectionné dans la liste
      const roleId = this.roles.find(r => r.name === this.roleForm.value.name)?.id;
      if (roleId) {
        roleData.id = roleId;
        this.roleService.updateRole(roleId, roleData).subscribe({
          next: (response) => {
            this.handleSaveSuccess('Rôle mis à jour avec succès.');
            // Enregistrer les privilèges du rôle
            this.saveRolePrivileges(roleId);
          },
          error: (err: any) => this.handleSaveError('Erreur lors de la mise à jour du rôle.', err)
        });
      }
    } else {
      this.roleService.createRole(roleData).subscribe({
        next: (response: any) => {
          this.handleSaveSuccess('Rôle créé avec succès.');
          // Enregistrer les privilèges pour le nouveau rôle
          if (response && response.id) {
            this.saveRolePrivileges(response.id);
          }
        },
        error: (err: any) => this.handleSaveError('Erreur lors de la création du rôle.', err)
      });
    }
  }

  saveRolePrivileges(roleId: number): void {
    // Obtenir les IDs des privilèges sélectionnés
    const selectedPrivilegeIds = this.privileges
      .filter(p => p.selected)
      .map(p => p.id)
      .filter(id => id !== undefined) as number[];
      
    // Appel API pour enregistrer les privilèges
    this.roleService.assignPrivilegesToRole(roleId, selectedPrivilegeIds).subscribe({
      next: () => {
        console.log('Privilèges enregistrés avec succès');
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'enregistrement des privilèges', err);
        this.message = 'Le rôle a été sauvegardé, mais il y a eu une erreur lors de l\'attribution des privilèges.';
        this.isError = true;
      }
    });
  }

  handleSaveSuccess(msg: string): void {
    this.message = msg;
    this.isError = false;
    this.isLoading = false;
    this.loadRoles();
    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }

  handleSaveError(msg: string, err: any): void {
    this.message = msg;
    this.isError = true;
    this.isLoading = false;
    console.error(err);
  }

  confirmDelete(role: Role): void {
    this.roleToDelete = role;
    this.confirmDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.confirmDeleteModal = false;
    this.roleToDelete = null;
  }

  deleteRole(): void {
    if (!this.roleToDelete || !this.roleToDelete.id) return;
    
    this.isLoading = true;
    this.roleService.deleteRole(this.roleToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = 'Rôle supprimé avec succès.';
        this.isError = false;
        this.loadRoles();
        this.closeDeleteModal();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message = 'Erreur lors de la suppression du rôle.';
        this.isError = true;
        console.error(err);
      }
    });
  }

  // Méthodes pour la pagination
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRoles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRoles();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadRoles();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Méthodes pour la gestion des privilèges
  toggleAllPrivileges(category: string, value: boolean): void {
    this.privileges
      .filter(p => p.category === category)
      .forEach(p => p.selected = value);
  }

  toggleCategoryPrivileges(category: string, subcategory: string, value: boolean): void {
    this.privileges
      .filter(p => p.category === category && p.subcategory === subcategory)
      .forEach(p => p.selected = value);
  }

  toggleSubcategoryPrivileges(category: string, subcategory: string, subcategory2: string, value: boolean): void {
    this.privileges
      .filter(p => p.category === category && p.subcategory === subcategory && p.subcategory2 === subcategory2)
      .forEach(p => p.selected = value);
  }

  isCategorySelected(category: string): boolean {
    const categoryPrivileges = this.privileges.filter(p => p.category === category);
    return categoryPrivileges.length > 0 && categoryPrivileges.every(p => p.selected);
  }

  isSubcategorySelected(category: string, subcategory: string, subcategory2?: string): boolean {
    let subcategoryPrivileges;
    
    if (subcategory2) {
      subcategoryPrivileges = this.privileges.filter(p => 
        p.category === category && p.subcategory === subcategory && p.subcategory2 === subcategory2);
    } else {
      subcategoryPrivileges = this.privileges.filter(p => 
        p.category === category && p.subcategory === subcategory);
    }
    
    return subcategoryPrivileges.length > 0 && subcategoryPrivileges.every(p => p.selected);
  }

  // FIX: Corrected method signatures to handle Event objects correctly
  updateCategorySelection(category: string, subcategory: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    const allSelected = this.isSubcategorySelected(category, subcategory);
    this.toggleCategoryPrivileges(category, subcategory, !allSelected);
  }

  updateSubcategorySelection(category: string, subcategory: string, subcategory2?: string | Event, event?: Event): void {
    // Handle case when subcategory2 is actually an Event (from the template)
    if (subcategory2 instanceof Event) {
      event = subcategory2;
      subcategory2 = undefined;
    }
    
    if (event) {
      event.stopPropagation();
    }
    
    if (typeof subcategory2 === 'string') {
      const allSelected = this.isSubcategorySelected(category, subcategory, subcategory2);
      this.toggleSubcategoryPrivileges(category, subcategory, subcategory2, !allSelected);
    } else {
      const allSelected = this.isSubcategorySelected(category, subcategory);
      this.toggleCategoryPrivileges(category, subcategory, !allSelected);
    }
  }

  // Méthode pour obtenir les noms d'affichage des rôles
  getRoleDisplayName(role: string): string {
    if (!role) return 'Utilisateur';
    
    switch (role) {
      case 'ROLE_SUPER':
        return 'Administrateur principal';
      case 'ROLE_ADMIN':
        return 'Administrateur secondaire';
      case 'ROLE_ARCH':
        return 'Architecte';
      case 'ROLE_RESPO':
        return 'Responsable de contenu';
      default:
        return 'Utilisateur';
    }
  }
}