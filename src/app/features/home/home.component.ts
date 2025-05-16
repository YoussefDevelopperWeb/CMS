// home.component.ts - Version améliorée
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrlPipe } from '../../pipe/safe-resource-url.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule , SafeResourceUrlPipe]
})


export class HomeComponent implements OnInit {
  // Flags for UI state
  isLoading = true;
  isScrolled = false;
  
  // Location Information
  locationInfo = {
    address: 'Technopark de Casablanca, Route de Nouaceur, Casablanca, Maroc',
    phone: '+212 522 77 56 00',
    email: 'contact@medtech.ma',
    hours: {
      weekdays: '9h00 - 18h00',
      weekend: '9h00 - 13h00'
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.685617686058!2d-7.6427883!3d33.5426689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d3c77d56d57%3A0x39c864bef89a71f5!2sTechnopark%2C%20Casablanca!5e0!3m2!1sfr!2sma!4v1715451237721!5m2!1sfr!2sma'
  };

  // Features data
  features = [
    { 
      title: 'Éditeur Intuitif',
      description: 'Créez et modifiez votre contenu facilement avec notre éditeur simple mais puissant, adapté à tous les niveaux d\'expertise.',
      image: 'https://source.unsplash.com/random/600x400/?editor'
    },
    { 
      title: 'Gestion Avancée', 
      description: 'Organisez, catégorisez et gérez votre contenu avec des outils puissants conçus pour optimiser votre workflow.',
      image: 'https://source.unsplash.com/random/600x400/?management'
    },
    { 
      title: 'Analyse Performante', 
      description: 'Suivez les performances de votre contenu avec des analyses détaillées et des rapports personnalisés.',
      image: 'https://source.unsplash.com/random/600x400/?analytics'
    },
    { 
      title: 'Collaboration en Temps Réel', 
      description: 'Travaillez simultanément avec votre équipe sur les mêmes documents sans conflit de version.',
      image: 'https://source.unsplash.com/random/600x400/?collaboration'
    },
    { 
      title: 'Automatisation Intelligente', 
      description: 'Automatisez les tâches répétitives et les workflows avec notre moteur d\'automatisation facile à configurer.',
      image: 'https://source.unsplash.com/random/600x400/?automated'
    },
    { 
      title: 'Sécurité Renforcée', 
      description: 'Protégez vos données sensibles avec notre système de sécurité multicouche et chiffrement de bout en bout.',
      image: 'https://source.unsplash.com/random/600x400/?security'
    }
  ];

  // Testimonials data
  testimonials = [
    {
      text: "Cette plateforme a révolutionné notre façon de gérer le contenu. Simple, efficace et puissante. Je la recommande à toutes les équipes marketing qui cherchent à optimiser leur workflow et à améliorer leur productivité.",
      author: "Marie Dupont",
      position: "Directrice Marketing, Tech Solutions"
    },
    {
      text: "Un outil indispensable pour notre équipe éditoriale. Nous avons augmenté notre productivité de 40% et la qualité de notre contenu s'est nettement améliorée. L'interface est intuitive et la collaboration en temps réel est un vrai plus.",
      author: "Thomas Martin",
      position: "Rédacteur en chef, Magazine Digital"
    },
    {
      text: "La sécurité était notre préoccupation principale lors du choix d'une solution de gestion de contenu. Cette plateforme a dépassé toutes nos attentes avec son système de chiffrement de bout en bout et ses contrôles d'accès granulaires.",
      author: "Sophie Leblanc",
      position: "RSSI, Groupe Financier International"
    }
  ];

  // Stats data
  stats = [
    { number: '5000+', text: 'Utilisateurs Actifs', icon: 'people' },
    { number: '250K+', text: 'Documents Gérés', icon: 'file-earmark-text' },
    { number: '300+', text: 'Entreprises', icon: 'building' },
    { number: '20+', text: 'Pays Desservis', icon: 'globe' }
  ];

  // Blog articles data
  blogArticles = [
    {
      title: 'Comment optimiser votre stratégie de contenu en 2025',
      description: 'Découvrez les dernières tendances et techniques pour améliorer l\'efficacité de votre stratégie de contenu et augmenter votre ROI.',
      date: '12 Mai 2025',
      category: 'Marketing',
      image: 'https://source.unsplash.com/random/600x400/?content-marketing',
      author: {
        name: 'Laura Martin',
        avatar: 'https://i.pravatar.cc/300?img=1'
      }
    },
    {
      title: '5 méthodes pour améliorer la collaboration d\'équipe à distance',
      description: 'Apprenez comment maintenir une collaboration efficace et productive avec votre équipe, même lorsque vous travaillez à distance.',
      date: '5 Mai 2025',
      category: 'Productivité',
      image: 'https://source.unsplash.com/random/600x400/?collaboration',
      author: {
        name: 'Thomas Dubois',
        avatar: 'https://i.pravatar.cc/300?img=2'
      }
    },
    {
      title: 'Protégez vos données d\'entreprise : guide essentiel',
      description: 'Un guide complet sur les meilleures pratiques pour sécuriser vos documents sensibles et protéger votre entreprise contre les cybermenaces.',
      date: '28 Avr 2025',
      category: 'Sécurité',
      image: 'https://source.unsplash.com/random/600x400/?security',
      author: {
        name: 'Marc Leroy',
        avatar: 'https://i.pravatar.cc/300?img=3'
      }
    }
  ];

  // FAQ data
  faqItems = [
    {
      question: 'Comment commencer avec la plateforme ?',
      answer: 'Commencer est simple ! Inscrivez-vous pour un essai gratuit de 14 jours, aucune carte de crédit n\'est requise. Vous aurez accès à toutes les fonctionnalités et pourrez créer votre premier projet en quelques minutes. Notre assistant de démarrage vous guidera à travers les premières étapes pour configurer votre espace de travail.',
      expanded: true
    },
    {
      question: 'Quels types de contenu puis-je gérer ?',
      answer: 'Notre plateforme prend en charge une large gamme de formats de contenu, y compris les documents texte, les images, les vidéos, les fichiers audio, les PDFs et bien plus encore. Vous pouvez organiser votre contenu en collections, ajouter des métadonnées personnalisées et créer des workflows adaptés à vos besoins spécifiques.',
      expanded: false
    },
    {
      question: 'La plateforme est-elle adaptée aux grandes équipes ?',
      answer: 'Absolument ! Notre plateforme est conçue pour s\'adapter à des équipes de toutes tailles, des freelances aux grandes entreprises. Elle offre des fonctionnalités avancées de gestion des rôles et permissions, permettant de définir précisément qui peut voir, modifier ou publier chaque élément de contenu. De plus, notre système de collaboration en temps réel permet à plusieurs utilisateurs de travailler simultanément sur le même document.',
      expanded: false
    },
    {
      question: 'Comment fonctionne la tarification ?',
      answer: 'Nous proposons plusieurs formules d\'abonnement pour répondre aux besoins de différents utilisateurs. Notre formule de base commence à 19€/mois et inclut toutes les fonctionnalités essentielles. Pour les équipes plus importantes, notre formule Pro à 49€/mois offre des fonctionnalités avancées de collaboration et d\'analyse. Nous proposons également des solutions personnalisées pour les grandes entreprises. Tous les plans incluent une assistance client et des mises à jour régulières.',
      expanded: false
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'La sécurité est notre priorité absolue. Nous utilisons un chiffrement de bout en bout pour protéger vos données, et nos serveurs sont conformes aux normes ISO 27001 et GDPR. Nous effectuons des audits de sécurité réguliers et offrons des fonctionnalités avancées comme l\'authentification à deux facteurs et les journaux d\'activité détaillés. Vous restez propriétaire de toutes vos données et pouvez les exporter à tout moment.',
      expanded: false
    }
  ];

  // Partners data
  partners = [
    { name: 'Partenaire 1', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+1' },
    { name: 'Partenaire 2', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+2' },
    { name: 'Partenaire 3', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+3' },
    { name: 'Partenaire 4', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+4' },
    { name: 'Partenaire 5', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+5' },
    { name: 'Partenaire 6', logo: 'https://placehold.co/150x80/2A41E8/ffffff?text=Partner+6' }
  ];

  constructor(
    private tokenStorage: TokenStorageService, 
    private router: Router,
    private sanitizer: DomSanitizer
    
  ) { }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/dashboard']);
    }
    
    // Simulate loading (remove in production)
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
    // Add scroll behavior to navbar
    this.checkScroll();
    
    // Add event listener for bootstrap components
    this.initBootstrapComponents();
  }

  // Listen for scroll events
  @HostListener('window:scroll')
  checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  
  // Sanitize Google Maps URL for safe binding
  safeResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Scroll to specific section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Scroll to registration section
  scrollToRegistration(): void {
    this.scrollToSection('cta');
  }
  
  // Scroll to top
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Open Google Maps in new tab
  openGoogleMaps(): void {
    window.open('https://www.google.com/maps/place/Technopark,+Casablanca/@33.5426689,-7.6427883,17z/data=!3m1!4b1!4m6!3m5!1s0xda62d3c77d56d57:0x39c864bef89a71f5!8m2!3d33.5429509!4d-7.6402319!16s%2Fg%2F1hhwrsf4w?entry=ttu', '_blank');
  }
  
  // Initialize Bootstrap components
  private initBootstrapComponents(): void {
    // Initialize tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipEl => {
      new bootstrap.Tooltip(tooltipEl);
    });
    
    // Initialize popovers
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(popoverEl => {
      new bootstrap.Popover(popoverEl);
    });
  }
  
  // Toggle FAQ item
  toggleFaqItem(index: number): void {
    this.faqItems[index].expanded = !this.faqItems[index].expanded;
  }
}

