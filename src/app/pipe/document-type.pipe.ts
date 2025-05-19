import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentType',
  standalone: true
})
export class DocumentTypePipe implements PipeTransform {
  transform(mimeType: string): string {
    if (!mimeType) return 'Inconnu';
    
    if (mimeType.includes('pdf')) {
      return 'PDF';
    } else if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) {
      return 'Document Word';
    } else if (mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
      return 'Feuille Excel';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('pptx') || mimeType.includes('ppt')) {
      return 'Présentation PowerPoint';
    } else if (mimeType.includes('image/')) {
      return 'Image';
    } else if (mimeType.includes('text/')) {
      return 'Texte';
    } else if (mimeType.includes('video/')) {
      return 'Vidéo';
    } else if (mimeType.includes('audio/')) {
      return 'Audio';
    } else {
      return 'Fichier';
    }
  }
}
