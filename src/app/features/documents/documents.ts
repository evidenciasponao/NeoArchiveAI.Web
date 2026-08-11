import { Component, OnInit, inject, signal } from '@angular/core';

import { Document } from '../../core/models/document.model';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-documents',
  imports: [],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class Documents implements OnInit {

  private readonly documentService = inject(DocumentService);

  readonly documents = signal<Document[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.documentService.getDocuments().subscribe({
      next: documents => {
        this.documents.set(documents);
        this.isLoading.set(false);
      },

      error: error => {
        console.error('Failed to load documents:', error);

        this.errorMessage.set(
          'Unable to load documents.'
        );

        this.isLoading.set(false);
      }
    });
  }
}
