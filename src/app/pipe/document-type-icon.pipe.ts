import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentTypeIcon',
  standalone: true
})
export class DocumentTypeIconPipe implements PipeTransform {
  transform(mimeType: string): string {
    if (!mimeType) return 'fas fa-file';
    
    if (mimeType.includes('pdf')) {
      return 'far fa-file-pdf';
    } else if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) {
      return 'far fa-file-word';
    } else if (mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
      return 'far fa-file-excel';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('pptx') || mimeType.includes('ppt')) {
      return 'far fa-file-powerpoint';
    } else if (mimeType.includes('image/')) {
      return 'far fa-file-image';
    } else if (mimeType.includes('text/')) {
      return 'far fa-file-alt';
    } else if (mimeType.includes('video/')) {
      return 'far fa-file-video';
    } else if (mimeType.includes('audio/')) {
      return 'far fa-file-audio';
    } else if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
      return 'far fa-file-archive';
    } else {
      return 'far fa-file';
    }
  }
}