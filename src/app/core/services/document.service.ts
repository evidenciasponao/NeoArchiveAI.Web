
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Document } from '../models/document.model';

export interface UpdateDocumentRequest {
  title: string;
  description: string;
  categoryId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://192.168.1.32:5263/api/Documents';

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(
      `${this.apiUrl}/${id}`
    );
  }

  uploadDocument(
    file: File,
    title: string,
    description: string,
    categoryId: string,
    uploadedBy: string
  ): Observable<Document> {

    const formData = new FormData();

    formData.append('File', file);
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append('CategoryId', categoryId);
    formData.append('UploadedBy', uploadedBy);

    return this.http.post<Document>(
      this.apiUrl,
      formData
    );
  }

  updateDocument(
    id: string,
    request: UpdateDocumentRequest
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
