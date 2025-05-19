// document.module.ts - Nouvelle version
import { NgModule } from '@angular/core';
import { DocumentsComponent } from './documents.component';

@NgModule({
  imports: [
    DocumentsComponent // Importez-le au lieu de le déclarer
  ],
  exports: [
    DocumentsComponent
  ]
})
export class DocumentsModule { }