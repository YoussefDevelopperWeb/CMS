import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleStatus',
  standalone: true
})
export class RoleStatusPipe implements PipeTransform {
  // Transforme un booléen en chaîne 'Actif' ou 'Inactif'
  transform(value: boolean): string {
    return value ? 'Actif' : 'Inactif';
  }
}