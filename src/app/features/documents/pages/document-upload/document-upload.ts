import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import { DocumentService } from '../../../../core/services/document.service';

@Component({
  selector: 'app-document-upload',
  imports: [FormsModule],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.scss'
})
export class DocumentUpload {

  private readonly authService = inject(AuthService);
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  title = '';
  description = '';
  categoryId = '';

  selectedFile: File | null = null;

  isUploading = false;
  errorMessage = '';

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }

    this.selectedFile = input.files[0];
  }

  upload(): void {

    this.errorMessage = '';

    const user = this.currentUser();

    if (!user) {
      this.errorMessage = 'User session not found.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file.';
      return;
    }

    if (!this.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    if (!this.categoryId) {
      this.errorMessage = 'Category is required.';
      return;
    }

    this.isUploading = true;

    this.documentService
      .uploadDocument(
        this.selectedFile,
        this.title.trim(),
        this.description.trim(),
        this.categoryId,
        user.id
      )
      .subscribe({
        next: () => {
          this.isUploading = false;

          this.router.navigate(['/documents']);
        },

        error: error => {
          console.error('UPLOAD DOCUMENT ERROR:', error);

          this.isUploading = false;

          this.errorMessage =
            'The document could not be uploaded.';
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }
}
