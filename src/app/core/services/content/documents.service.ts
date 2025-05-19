import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  getDocuments(page: number = 0, size: number = 10, sort: string = 'updatedAt', direction: string = 'desc'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}&direction=${direction}`);
  }

  // Méthode d'upload de document - utilise simplement FormData avec les paramètres attendus par le backend
  uploadDocument(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  archiveDocument(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archive`, {});
  }

  restoreDocument(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/restore`, {});
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  submitForApproval(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/submit`, {});
  }

  approveDocument(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectDocument(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, { reason });
  }
}