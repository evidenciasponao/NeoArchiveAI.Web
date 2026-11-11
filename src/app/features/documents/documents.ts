
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Document } from '../../core/models/document.model';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-documents',
  imports: [RouterLink],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class Documents implements OnInit {

  private readonly documentService = inject(DocumentService);

  readonly documents = signal<Document[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly deletingDocumentId = signal<string | null>(null);
  readonly downloadingDocumentId = signal<string | null>(null);

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

  downloadDocument(document: Document): void {

    if (this.downloadingDocumentId() !== null) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.downloadingDocumentId.set(document.id);

    this.documentService.downloadDocument(document.id).subscribe({

      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');

        link.href = url;
        link.download = document.fileName;

        window.document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

        this.successMessage.set(
          'Document downloaded successfully.'
        );

        this.downloadingDocumentId.set(null);
      },

      error: error => {
        console.error('Failed to download document:', error);

        this.errorMessage.set(
          'Unable to download document.'
        );

        this.downloadingDocumentId.set(null);
      }

    });
  }

  deleteDocument(document: Document): void {

    if (this.deletingDocumentId() !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.deletingDocumentId.set(document.id);

    this.documentService.deleteDocument(document.id).subscribe({

      next: () => {
        this.documents.update(documents =>
          documents.filter(item => item.id !== document.id)
        );

        this.successMessage.set(
          'Document deleted successfully.'
        );

        this.deletingDocumentId.set(null);
      },

      error: error => {
        console.error('Failed to delete document:', error);

        this.errorMessage.set(
          'Unable to delete document.'
        );

        this.deletingDocumentId.set(null);
      }

    });
  }
}
