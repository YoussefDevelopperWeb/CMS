import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username,
      email,
      password
    }, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', {}, httpOptions);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth-token');
    return !!token;
  }

  // Obtenir le token d'authentification
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  // Enregistrer le token dans le stockage local
  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'password/reset-request', 
      { email }, 
      httpOptions
    );
  }
  
  // Méthode pour réinitialiser le mot de passe avec un code
  resetPassword(token: string, newPassword: string): Observable<any> {
    // console.log('Envoi du token:', token); // Vérifiez la console
    return this.http.post(
      AUTH_API + 'password/reset', 
      { 
        token, 
        password: newPassword 
      }, 
      httpOptions
    ).pipe(
      catchError(error => {
        console.error('Détails de l\'erreur:', error);
        throw error;
      })
    );
  }

}



// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, BehaviorSubject, of, Observable, tap, throwError, map } from 'rxjs';

// const AUTH_API = 'http://localhost:8080/api/auth/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   profileImage?: string;
//   token?: string;
//   roles?: string[];
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   public currentUser$: Observable<User | null>;
//   private currentUserSubject: BehaviorSubject<User | null>;
  
//   constructor(private http: HttpClient) {
//     const storedUser = localStorage.getItem('currentUser');
//     this.currentUserSubject = new BehaviorSubject<User | null>(
//       storedUser ? JSON.parse(storedUser) : null
//     );
//     this.currentUser$ = this.currentUserSubject.asObservable();
//   }

//   public get currentUserValue(): User | null {
//     return this.currentUserSubject.value;
//   }
  
//   // Get auth status
//   public get isAuthenticated(): boolean {
//     return !!this.currentUserSubject.value;
//   } 

//   login(username: string, password: string): Observable<any> {
//     return this.http.post(AUTH_API + 'login', {
//       username,
//       password
//     }, httpOptions).pipe(
//         tap(response => {
//           if (response) {
//             // Map backend response to our User interface
//             const user: User = {
//               id: response.id,
//               username: response.username,
//               email: response.email,
//               token: response.token || response.accessToken,
//               roles: response.roles
//             };
            
//             // Store user details and jwt token in local storage
//             localStorage.setItem('currentUser', JSON.stringify(user));
//             localStorage.setItem('auth_token', user.token);
//             this.currentUserSubject.next(user);
//           }
//           return response;
//         }),
//         catchError(error => {
//           console.error('Login error:', error);
//           return throwError(() => new Error('Login failed. Please check your credentials.'));
//         })
//       );
//   }

//   register(username: string, email: string, password: string): Observable<any> {
//     return this.http.post(AUTH_API + 'register', {
//       username,
//       email,
//       password,
//       roles: ['user'] // Default role
//     }, httpOptions);
//   }

//   logout(): Observable<any> {
//     // Clear local storage
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('auth_token');
//     this.currentUserSubject.next(null);

//     // Call logout endpoint
//     return this.http.post(AUTH_API + 'logout', {}, httpOptions).pipe(
//       catchError(error => {
//         console.error('Logout error:', error);
//         return of({ message: 'Logged out locally' });
//       })
//     );
//   }

//   // Check if user is logged in
//   isLoggedIn(): boolean {
//     const token = localStorage.getItem('auth_token');
//     return !!token;
//   }

//   // Get auth token
//   getToken(): string | null {
//     return localStorage.getItem('auth_token');
//   }

//   // Save token to local storage
//   saveToken(token: string): void {
//     localStorage.setItem('auth_token', token);
//   }

//   requestPasswordReset(email: string): Observable<any> {
//     return this.http.post(
//       AUTH_API + 'password/reset-request', 
//       { email }, 
//       httpOptions
//     );
//   }
  
//   // Method to reset password with a token
//   resetPassword(token: string, newPassword: string): Observable<any> {
//     return this.http.post(
//       AUTH_API + 'password/reset', 
//       { 
//         token, 
//         password: newPassword 
//       }, 
//       httpOptions
//     ).pipe(
//       catchError(error => {
//         console.error('Error details:', error);
//         throw error;
//       })
//     );
//   }

//   checkAuthStatus(): Observable<boolean> {
//     // If we don't have a token, short-circuit
//     if (!localStorage.getItem('auth_token')) {
//       return of(false);
//     }
    
//     return this.http.get<User>(AUTH_API + 'me')
//       .pipe(
//         map(user => {
//           // Update stored user info if needed
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           this.currentUserSubject.next(user);
//           return true;
//         }),
//         catchError(() => {
//           this.logout();
//           return of(false);
//         })
//       );
//   }

//   // Check if user has specific role
//   hasRole(role: string): boolean {
//     const user = this.currentUserValue;
//     if (!user || !user.roles) {
//       return false;
//     }
//     return user.roles.includes(role);
//   }

//   // Check if user is admin
//   isAdmin(): boolean {
//     return this.hasRole('ROLE_ADMIN');
//   }
// }