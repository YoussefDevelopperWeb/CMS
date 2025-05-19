// document.module.ts - Nouvelle version
import { NgModule } from '@angular/core';
import { DocumentsComponent } from '../documents/documents.component';

@NgModule({
  imports: [
    DocumentsComponent 
  ],
  exports: [
    DocumentsComponent
  ]
})
export class DocumentsModule { }