import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();
  
  @HostBinding('class.file-over') fileOver: boolean = false;
  
  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }
  
  // Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }
  
  // Drop listener
  @HostListener('drop', ['$event']) onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(Array.from(files));
    }
  }
}