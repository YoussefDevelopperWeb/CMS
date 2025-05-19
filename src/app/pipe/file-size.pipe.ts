import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true  // Assurez-vous que cette propriété est présente
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    if (sizeInBytes === 0) return '0 B';
    if (!sizeInBytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const base = 1024;
    
    const exponent = Math.min(
      Math.floor(Math.log(sizeInBytes) / Math.log(base)),
      units.length - 1
    );
    
    const size = sizeInBytes / Math.pow(base, exponent);
    const roundedSize = Math.round(size * 100) / 100;
    
    return `${roundedSize} ${units[exponent]}`;
  }
}