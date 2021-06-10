import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FileCard } from '../models/file';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private baseUrl = 'http://localhost:3000/files';

  constructor(private http: HttpClient) {}

  upload(file: File, path: string) {
    const formData: FormData = new FormData();
    formData.append('path', path);
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
    });
  }

  listFiles(path: string, location: string) {
    const body = {
      path,
      location,
    };

    return this.http.post<FileCard[]>(`${this.baseUrl}`, body);
  }

  createFolder(folder: string, path: string) {
    const body = {
      folder,
      path,
    };

    return this.http.post(`${this.baseUrl}/folder`, body);
  }

  deleteFile(file: FileCard) {
    return this.http.post(`${this.baseUrl}/delete`, file);
  }

  downloadFile(file: FileCard) {
    return this.http.post(`${this.baseUrl}/download`, file, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  shareFile(file: FileCard, email: string) {
    const body = {
      file,
      email
    };

    return this.http.post(`${this.baseUrl}/share`, body);
  }
}
