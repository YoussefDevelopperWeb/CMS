import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { UserService } from '../../../../core/services/user.service';


@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeContentComponent implements OnInit {
  // Données utilisateur
  username: string = '';
  
  // État de la recherche
  isSearchExpanded: boolean = false;
  
  // Données pour les cartes d'information
  cardData = {
    images: { count: 0, label: 'Images' },
    videos: { count: 0, label: 'Vidéos' },
    picto: { count: 0, label: 'Pictos' },
    documents: { count: 0, label: 'Documents' }
  };
  
  // Données pour le graphique donut - Ajout des statuts supplémentaires
  chartData = [
    { status: 'Publié', count: 68, color: '#3b82f6' },
    { status: 'En attente', count: 24, color: '#f59e0b' },
    { status: 'Brouillon', count: 12, color: '#6b7280' },
    { status: 'Archivé', count: 45, color: '#9ca3af' },
    { status: 'Erreur', count: 8, color: '#ef4444' },
    { status: 'Planifié', count: 16, color: '#8b5cf6' }
  ];
  
  // Données pour les activités récentes
  recentActivities = [
    {
      type: 'upload',
      title: 'Image ajoutée',
      detail: 'Vous avez ajouté une nouvelle image "banner-homepage.jpg"',
      time: 'Il y a 2h'
    },
    {
      type: 'edit',
      title: 'Document mis à jour',
      detail: 'Manuel d\'utilisation v2.1',
      time: 'Hier'
    },
    {
      type: 'delete',
      title: 'Vidéo supprimée',
      detail: 'La vidéo "intro-old.mp4" a été supprimée',
      time: 'Il y a 2j'
    },
    {
      type: 'view',
      title: 'Document consulté',
      detail: 'Charte graphique 2023',
      time: 'Il y a 3j'
    }
  ];

  constructor(
    private token: TokenStorageService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Récupérer les données de l'utilisateur connecté
    this.loadUserData();
    
    // Charger les statistiques du dashboard
    this.loadDashboardStats();
  }

  loadUserData(): void {
    const user = this.token.getUser();
    if (user) {
      this.username = user.username || 'Utilisateur';
    }
  }

  loadDashboardStats(): void {
    // Cette méthode serait normalement utilisée pour charger les données
    // depuis le backend via un service. Pour l'instant, nous simulons les données.
    
    // Simuler un chargement des données de stats
    setTimeout(() => {
      // Ces données seraient normalement récupérées depuis l'API
      this.cardData = {
        images: { count: 124, label: 'Images' },
        videos: { count: 48, label: 'Vidéos' },
        picto: { count: 73, label: 'Pictos' },
        documents: { count: 61, label: 'Documents' }
      };
      
      // Récupérer les activités récentes (simulation)
      this.loadRecentActivities();
    }, 300);
  }

  loadRecentActivities(): void {
    // Cette méthode serait utilisée pour charger les activités récentes depuis le backend
    // Pour l'instant, nous utilisons les données statiques définies dans la classe
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded;
  }

  closeSearch(event: Event): void {
    event.stopPropagation();
    this.isSearchExpanded = false;
  }

  search(event: KeyboardEvent): void {
    // Implémentation de la recherche
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Recherche:', searchTerm);
    
    // Logique de recherche à implémenter
    if (event.key === 'Escape') {
      this.isSearchExpanded = false;
    }
  }

  // Méthodes pour le graphique donut
  getDonutSegment(count: number, index: number): string {
    const totalCount = this.chartData.reduce((sum, item) => sum + item.count, 0);
    const percentage = count / totalCount;
    
    // La circonférence du cercle est de 2 * PI * rayon
    // Nous utilisons un rayon de 40, donc la circonférence est de 2 * PI * 40 = 251.2
    const circumference = 2 * Math.PI * 40;
    
    return `${percentage * circumference} ${(1 - percentage) * circumference}`;
  }

  getDonutOffset(index: number): string {
    const totalCount = this.chartData.reduce((sum, item) => sum + item.count, 0);
    let offset = 0;
    
    // Calculer le décalage en fonction des segments précédents
    for (let i = 0; i < index; i++) {
      const percentage = this.chartData[i].count / totalCount;
      offset += percentage * (2 * Math.PI * 40); // 2 * PI * rayon
    }
    
    // Le décalage doit être négatif pour que les segments se suivent dans le sens horaire
    return `${-offset}`;
  }
  
  // Ajouter une méthode pour calculer le pourcentage pour un meilleur affichage
  getPercentage(count: number): string {
    const totalCount = this.chartData.reduce((sum, item) => sum + item.count, 0);
    const percentage = (count / totalCount) * 100;
    return percentage.toFixed(1) + '%';
  }
}