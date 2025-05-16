import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { ProfileService } from '../../../core/services/profile.service';

export interface User {
  id?: number;
  username: string;
  email: string;
  fonction: string;
  role?: string; // Added role property for display purposes
  createdAt?: Date;
  enabled?: boolean;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  // Statut chargement
  isLoading: boolean = true;
  
  // Formulaire
  profileForm!: FormGroup;
  isEditing: boolean = false;
  
  // Messages d'alerte
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // Données utilisateur
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private profileService: ProfileService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    // Initialiser le formulaire
    this.initForm();
    
    // Charger les données utilisateur
    this.loadUserProfile();
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fonction: ['', Validators.required]
    });
    
    // Désactiver le formulaire par défaut (mode lecture)
    this.profileForm.disable();
  }

  loadUserProfile(): void {
    // Simuler un délai de chargement pour montrer le loader
    setTimeout(() => {
      this.currentUser = this.tokenStorage.getUser();
      
      if (this.currentUser) {
        
        // Remplir le formulaire avec les données utilisateur
        this.profileForm.patchValue({
          username: this.currentUser.username || '',
          email: this.currentUser.email || '',
          fonction: this.currentUser.fonction || 'Non spécifiée'
        });
        console.log(this.currentUser)
        // Ajouter le rôle pour affichage
        if (this.currentUser.roles && this.currentUser.roles.length > 0) {
          // Convertir ROLE_ADMIN en Admin pour l'affichage
          if (typeof this.currentUser.roles[0] === 'string') {
            this.currentUser.role = this.currentUser.roles[0].replace('ROLE_', '');
          } else if (this.currentUser.roles[0].name) {
            this.currentUser.role = this.currentUser.roles[0].name.replace('ROLE_', '');
          }
        }
      } else {
        // Si pas d'utilisateur, afficher un message d'erreur
        this.showError('Utilisateur non trouvé. Veuillez vous reconnecter.');
      }
      
      this.isLoading = false;
    }, 800);
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get usernameControl() { return this.profileForm.get('username')!; }
  get emailControl() { return this.profileForm.get('email')!; }
  get fonctionControl() { return this.profileForm.get('fonction')!; }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      // Activer le formulaire en mode édition
      this.profileForm.enable();
    } else {
      // Désactiver le formulaire et réinitialiser avec les valeurs actuelles
      this.profileForm.disable();
      this.profileForm.patchValue({
        username: this.currentUser.username || '',
        email: this.currentUser.email || '',
        fonction: this.currentUser.fonction || 'Non spécifiée'
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    // Afficher le loader
    this.isLoading = true;
    
    // Récupérer les valeurs du formulaire
    const profileData = this.profileForm.value;
    
    // Appeler le service pour mettre à jour le profil
    this.profileService.updateUserProfile(profileData).subscribe({
      next: (response) => {
        // Mettre à jour les données utilisateur en local
        this.currentUser = {
          ...this.currentUser,
          username: profileData.username,
          email: profileData.email,
          fonction: profileData.fonction
        };
        
        // Mettre à jour le token storage
        this.tokenStorage.saveUser(this.currentUser);
        
        // Désactiver le mode édition
        this.isEditing = false;
        this.profileForm.disable();
        
        // Afficher un message de succès
        this.showSuccess('Profil mis à jour avec succès !');
        
        // Masquer le loader
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil:', err);
        
        // Afficher un message d'erreur
        this.showError(err.error?.message || 'Une erreur est survenue lors de la mise à jour du profil.');
        
        // Masquer le loader
        this.isLoading = false;
      }
    });
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    this.showErrorAlert = false;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorAlert = true;
    this.showSuccessAlert = false;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      this.showErrorAlert = false;
    }, 5000);
  }
}