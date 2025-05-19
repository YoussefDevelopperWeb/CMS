
// document-type-class.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentTypeClass',
  standalone: true
})
export class DocumentTypeClassPipe implements PipeTransform {
  transform(mimeType: string): string {
    if (!mimeType) return 'file-unknown';
    
    if (mimeType.includes('pdf')) {
      return 'file-pdf';
    } else if (mimeType.includes('word') || mimeType.includes('docx') || mimeType.includes('doc')) {
      return 'file-word';
    } else if (mimeType.includes('excel') || mimeType.includes('xlsx') || mimeType.includes('xls')) {
      return 'file-excel';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('pptx') || mimeType.includes('ppt')) {
      return 'file-powerpoint';
    } else if (mimeType.includes('image/')) {
      return 'file-image';
    } else if (mimeType.includes('text/')) {
      return 'file-text';
    } else if (mimeType.includes('video/')) {
      return 'file-video';
    } else if (mimeType.includes('audio/')) {
      return 'file-audio';
    } else if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
      return 'file-archive';
    } else {
      return 'file-generic';
    }
  }
}