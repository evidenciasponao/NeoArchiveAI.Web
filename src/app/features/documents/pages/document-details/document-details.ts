
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Document } from '../../../../core/models/document.model';

import {
  DocumentService,
  UpdateDocumentRequest
} from '../../../../core/services/document.service';

@Component({
  selector: 'app-document-details',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './document-details.html',
  styleUrl: './document-details.scss'
})
export class DocumentDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly documentService = inject(DocumentService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  document: Document | null = null;

  isLoading = true;
  isEditing = false;
  isSaving = false;

  editTitle = '';
  editDescription = '';
  editCategoryId = '';

  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {

    console.log('DOCUMENT DETAILS: ngOnInit');

    const id = this.route.snapshot.paramMap.get('id');

    console.log('DOCUMENT ID:', id);

    if (!id) {

      console.error('DOCUMENT ID NOT FOUND');

      this.isLoading = false;
      this.changeDetector.detectChanges();

      return;
    }

    console.log('REQUESTING DOCUMENT...');

    this.documentService.getDocumentById(id).subscribe({

      next: (document) => {

        console.log('DOCUMENT RECEIVED:', document);

        this.document = document;
        this.isLoading = false;

        console.log('DOCUMENT STATE:', this.document);

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR LOADING DOCUMENT:',
          error
        );

        this.isLoading = false;

        this.changeDetector.detectChanges();
      },

      complete: () => {

        console.log('DOCUMENT REQUEST COMPLETED');

      }

    });
  }

  startEditing(): void {

    if (!this.document) {
      return;
    }

    this.editTitle = this.document.title;
    this.editDescription = this.document.description ?? '';
    this.editCategoryId = this.document.categoryId;

    this.successMessage = '';
    this.errorMessage = '';

    this.isEditing = true;
  }

  cancelEditing(): void {

    if (this.isSaving) {
      return;
    }

    this.isEditing = false;

    this.successMessage = '';
    this.errorMessage = '';
  }

  saveChanges(): void {

    if (!this.document || this.isSaving) {
      return;
    }

    const title = this.editTitle.trim();
    const description = this.editDescription.trim();
    const categoryId = this.editCategoryId.trim();

    if (!title) {
      this.errorMessage = 'Title is required.';
      return;
    }

    if (!categoryId) {
      this.errorMessage = 'Category ID is required.';
      return;
    }

    if (title.length > 200) {
      this.errorMessage = 'Title cannot exceed 200 characters.';
      return;
    }

    if (description.length > 1000) {
      this.errorMessage = 'Description cannot exceed 1000 characters.';
      return;
    }

    const request: UpdateDocumentRequest = {
      title,
      description,
      categoryId
    };

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.documentService.updateDocument(
      this.document.id,
      request
    ).subscribe({

      next: () => {

        if (!this.document) {
          return;
        }

        this.document = {
          ...this.document,
          title,
          description,
          categoryId
        };

        this.isEditing = false;
        this.isSaving = false;

        this.successMessage = 'Document updated successfully.';

        this.changeDetector.detectChanges();
      },

      error: (error) => {

        console.error(
          'ERROR UPDATING DOCUMENT:',
          error
        );

        this.isSaving = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to update document. Please try again.';

        this.changeDetector.detectChanges();
      }

    });
  }
}
