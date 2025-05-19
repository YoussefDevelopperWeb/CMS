import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusClass',
  standalone: true
})
export class StatusClassPipe implements PipeTransform {
  transform(status: string): string {
    if (!status) return '';
    
    switch (status) {
      case 'Publié':
        return 'status-published';
      case 'Brouillon':
        return 'status-draft';
      case 'Archivé':
        return 'status-archived';
      default:
        return '';
    }
  }
}