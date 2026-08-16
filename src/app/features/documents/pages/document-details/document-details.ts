import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Document } from '../../../../core/models/document.model';
import { DocumentService } from '../../../../core/services/document.service';

@Component({
  selector: 'app-document-details',
  imports: [RouterLink],
  templateUrl: './document-details.html',
  styleUrl: './document-details.scss'
})
export class DocumentDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly documentService = inject(DocumentService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  document: Document | null = null;
  isLoading = true;

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
        console.log('IS LOADING:', this.isLoading);

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

        console.log(
          'DOCUMENT REQUEST COMPLETED'
        );

      }

    });
  }
}
