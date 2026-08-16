export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  extension: string;
  mimeType: string;
  size: number;
  storagePath: string;
  hash: string;
  categoryId: string;
  uploadedBy: string;
}
