// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TokenStorageService } from '../../../core/services/token-storage.service';
// import { UserService } from '../../../core/services/user.service';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule
//   ]
// })
// export class ProfileComponent implements OnInit {
//   currentUser: any;
//   userDetails: any;
//   isEditing = false;
//   message = '';
//   isUpdateSuccess = false;
//   isUpdateFailed = false;

//   constructor(
//     private token: TokenStorageService,
//     private userService: UserService
//   ) { }

//   ngOnInit(): void {
//     this.currentUser = this.token.getUser();
//     this.loadUserProfile();
//   }

//   loadUserProfile(): void {
//     this.userService.getUserProfile().subscribe({
//       next: (data) => {
//         this.userDetails = data;
//       },
//       error: (err) => {
//         console.error('Error loading user profile:', err);
//         this.message = err.error?.message || 'Erreur lors du chargement du profil utilisateur';
//       }
//     });
//   }

//   toggleEdit(): void {
//     this.isEditing = !this.isEditing;
//     this.isUpdateSuccess = false;
//     this.isUpdateFailed = false;
//   }

//   onSubmit(): void {
//     this.userService.updateUserProfile(this.userDetails).subscribe({
//       next: (response) => {
//         this.isUpdateSuccess = true;
//         this.isUpdateFailed = false;
//         this.message = response.message;
//         this.isEditing = false;
//         // Update profile data
//         this.loadUserProfile();
//       },
//       error: (err) => {
//         this.isUpdateFailed = true;
//         this.isUpdateSuccess = false;
//         this.message = err.error.message;
//       }
//     });
//   }
// }