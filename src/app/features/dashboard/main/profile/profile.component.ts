// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../../core/services/auth.service';
// import { UserService } from '../../../../core/services/user.service';

// export interface User {
//   id?: number;
//   username: string;
//   email: string;
//   fonction: string;
//   createdAt?: Date;
//   enabled?: boolean;
//   role?: string;
// }

// @Component({
//   selector: 'app-profiles',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss']
// })
// export class ProfileComponent implements OnInit {
//   profileForm: FormGroup;
//   currentUser: User;
//   isEditing = false;
//   isLoading = true;
//   errorMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private authService: AuthService,
//     private toastr: ToastrService
//   ) { }

//   ngOnInit(): void {
//     this.initForm();
//     this.loadUserProfile();
//   }

//   initForm(): void {
//     this.profileForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       fonction: ['', Validators.required]
//     });
    
//     // Disable form initially
//     this.profileForm.disable();
//   }

//   loadUserProfile(): void {
//     this.isLoading = true;
//     this.authService.getCurrentUser().subscribe(
//       (user: User) => {
//         this.currentUser = user;
//         this.profileForm.patchValue({
//           username: user.username,
//           email: user.email,
//           fonction: user.fonction
//         });
//         this.isLoading = false;
//       },
//       error => {
//         this.errorMessage = 'Impossible de charger les données utilisateur. Veuillez réessayer.';
//         this.isLoading = false;
//         this.toastr.error(this.errorMessage);
//         console.error('Error loading user profile:', error);
//       }
//     );
//   }

//   toggleEditMode(): void {
//     this.isEditing = !this.isEditing;
    
//     if (this.isEditing) {
//       this.profileForm.enable();
//     } else {
//       this.profileForm.disable();
//       // Reset form to current user values if editing is cancelled
//       this.profileForm.patchValue({
//         username: this.currentUser.username,
//         email: this.currentUser.email,
//         fonction: this.currentUser.fonction
//       });
//     }
//   }

//   saveProfile(): void {
//     if (this.profileForm.invalid) {
//       this.profileForm.markAllAsTouched();
//       return;
//     }

//     const updatedUser = {
//       ...this.currentUser,
//       ...this.profileForm.value
//     };

//     this.isLoading = true;
//     this.userService.updateUser(updatedUser).subscribe(
//       (result: User) => {
//         this.currentUser = result;
//         this.isEditing = false;
//         this.profileForm.disable();
//         this.isLoading = false;
//         this.toastr.success('Profil mis à jour avec succès');
//       },
//       error => {
//         this.isLoading = false;
//         this.errorMessage = 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
//         this.toastr.error(this.errorMessage);
//         console.error('Error updating profile:', error);
//       }
//     );
//   }

//   // Helper methods for validation
//   get usernameControl() { return this.profileForm.get('username'); }
//   get emailControl() { return this.profileForm.get('email'); }
//   get fonctionControl() { return this.profileForm.get('fonction'); }
// }