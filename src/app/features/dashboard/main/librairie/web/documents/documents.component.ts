import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DocumentsService } from '../../../../../../core/services/content/documents.service';
// import { NotificationService } from '../../../../../../core/services/notification.service';
import { FileSizePipe } from "../../../../../../pipe/file-size.pipe";
import { CommonModule } from '@angular/common';
import { StatusLabelPipe } from  "../../../../../../pipe/status-label.pipe" ;
import { Modal } from 'bootstrap'; 


export interface Document {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileType: string;  // pdf, docx, xlsx, etc.
  fileSize: number;  // en octets
  mimeType: string;
  contentPath: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT' | 'PENDING_APPROVAL' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    username: string;
  };
  lastModifiedBy: {
    id: number;
    username: string;
  };
  keywords: string[];
}

// Mise à jour des imports du composant
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    FileSizePipe,
    StatusLabelPipe  // Ajout du pipe ici
  ]
})

export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  filterForm: FormGroup;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'updatedAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  isAdmin: boolean = true; 
  // Ajout de Math pour l'utiliser dans le template
  Math: any = Math;
  
  constructor(
    private documentsService: DocumentsService,
    private formBuilder: FormBuilder,
    // private notificationService: NotificationService
  ) {
    this.filterForm = this.formBuilder.group({
      idFilter: [''],
      keywordsFilter: [''],
      statusFilter: ['']
    });
    
    this.uploadForm = this.formBuilder.group({
      title: [''],
      description: [''],
      keywords: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadDocuments(): void {
    this.documentsService.getDocuments(
      this.currentPage - 1,
      this.itemsPerPage,
      this.sortBy,
      this.sortDirection
    ).subscribe(
      response => {
        this.documents = response.content;
        this.filteredDocuments = this.documents;
        this.totalItems = response.totalElements;
        this.applyFilters();
      },
      error => {
        // this.notificationService.error('Erreur lors du chargement des documents');
        console.error('Error loading documents', error);
      }
    );
  }

// À ajouter dans votre classe DocumentsComponent
// _____________________________________________________________________________________________________________________________________________________
isEditableStatus(status: string): boolean {
  return ['DRAFT', 'REJECTED', 'PENDING_APPROVAL'].includes(status);
}

submitForApproval(doc: Document): void {
  if (confirm('Êtes-vous sûr de vouloir soumettre ce document pour validation ?')) {
    this.documentsService.submitForApproval(doc.id).subscribe(
      () => {
        // this.notificationService.success('Document soumis pour validation');
        console.log('Document soumis pour validation');
        this.loadDocuments();
      },
      error => {
        // this.notificationService.error('Erreur lors de la soumission du document');
        console.error('Submit error', error);
      }
    );
  }
}
editDocument(doc: Document): void {
  // Rediriger vers une page d'édition ou afficher un modal d'édition
  console.log('Édition du document', doc);
  // Exemple : this.router.navigate(['/dashboard/documents/edit', doc.id]);
}

approveDocument(doc: Document): void {
  if (confirm('Êtes-vous sûr de vouloir approuver ce document ?')) {
    this.documentsService.approveDocument(doc.id).subscribe(
      () => {
        // this.notificationService.success('Document approuvé');
        console.log('Document approuvé');
        this.loadDocuments();
      },
      error => {
        // this.notificationService.error('Erreur lors de l\'approbation du document');
        console.error('Approve error', error);
      }
    );
  }
}

rejectDocument(doc: Document): void {
  const reason = prompt('Veuillez indiquer la raison du rejet :');
  if (reason !== null) { // Si l'utilisateur n'a pas annulé
    this.documentsService.rejectDocument(doc.id, reason).subscribe(
      () => {
        // this.notificationService.success('Document rejeté');
        console.log('Document rejeté');
        this.loadDocuments();
      },
      error => {
        // this.notificationService.error('Erreur lors du rejet du document');
        console.error('Reject error', error);
      }
    );
  }
}

restoreDocument(doc: Document): void {
  if (confirm('Êtes-vous sûr de vouloir restaurer ce document ?')) {
    this.documentsService.restoreDocument(doc.id).subscribe(
      () => {
        // this.notificationService.success('Document restauré');
        console.log('Document restauré');
        this.loadDocuments();
      },
      error => {
        // this.notificationService.error('Erreur lors de la restauration du document');
        console.error('Restore error', error);
      }
    );
  }
}
// _____________________________________________________________________________________________________________________________________________________

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    
    // Auto-populate title with filename (without extension)
    if (this.selectedFile) {
      const fileName = this.selectedFile.name;
      const title = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      this.uploadForm.patchValue({ title });
    }
  }

uploadDocument(): void {
  if (!this.selectedFile) {
    // this.notificationService.warning('Veuillez sélectionner un fichier');
    console.warn('Veuillez sélectionner un fichier');
    return;
  }

  this.isUploading = true;
  this.uploadProgress = 0;

  const formData = new FormData();
  // Utiliser le nom 'file' au lieu de 'documentData' comme attendu par le backend
  formData.append('file', this.selectedFile);
  formData.append('title', this.uploadForm.get('title')?.value || '');
  formData.append('description', this.uploadForm.get('description')?.value || '');
  formData.append('keywords', this.uploadForm.get('keywords')?.value || '');

  this.documentsService.uploadDocument(formData)
    .pipe(
      finalize(() => {
        this.isUploading = false;
        this.selectedFile = null;
        this.uploadForm.reset();
        // Fermer le modal après upload réussi
          const modalElement = document.getElementById('uploadDocumentModal');
          if (modalElement) {
            const modal = Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
      })
    )
    .subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          // this.notificationService.success('Document téléchargé avec succès');
          console.log('Document téléchargé avec succès');
          this.loadDocuments();
        }
      },
      error => {
        // this.notificationService.error('Erreur lors du téléchargement du document');
        console.error('Upload error', error);
      }
    );
}

  applyFilters(): void {
    let filtered = [...this.documents];
    
    const idFilter = this.filterForm.get('idFilter')?.value;
    const keywordsFilter = this.filterForm.get('keywordsFilter')?.value;
    const statusFilter = this.filterForm.get('statusFilter')?.value;
    
    if (idFilter) {
      filtered = filtered.filter(doc => 
        doc.id.toString().includes(idFilter) || doc.fileName.toLowerCase().includes(idFilter.toLowerCase())
      );
    }
    
    if (keywordsFilter) {
      const keywords = keywordsFilter.toLowerCase().split(',').map((k: string) => k.trim());
      filtered = filtered.filter(doc => 
        keywords.some((keyword: string) => 
          doc.keywords.some(k => k.toLowerCase().includes(keyword))
        )
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }
    
    this.filteredDocuments = filtered;
  }

  changeViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDocuments();
  }

  downloadDocument(doc: Document): void {
    this.documentsService.downloadDocument(doc.id).subscribe(
      response => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        // this.notificationService.error('Erreur lors du téléchargement du document');
        console.error('Download error', error);
      }
    );
  }

  archiveDocument(doc: Document): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce document ?')) {
      this.documentsService.archiveDocument(doc.id).subscribe(
        () => {
        //   this.notificationService.success('Document archivé avec succès');
          this.loadDocuments();
        },
        error => {
        //   this.notificationService.error('Erreur lors de l\'archivage du document');
          console.error('Archive error', error);
        }
      );
    }
  }

  deleteDocument(doc: Document): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.')) {
      this.documentsService.deleteDocument(doc.id).subscribe(
        () => {
        //   this.notificationService.success('Document supprimé avec succès');
          this.loadDocuments();
        },
        error => {
        //   this.notificationService.error('Erreur lors de la suppression du document');
          console.error('Delete error', error);
        }
      );
    }
  }
}