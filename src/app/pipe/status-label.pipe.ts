import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'ARCHIVED':
        return 'Archivé';
      case 'DRAFT':
        return 'Brouillon';
      case 'PENDING_APPROVAL':
        return 'En attente';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return status;
    }
  }
}