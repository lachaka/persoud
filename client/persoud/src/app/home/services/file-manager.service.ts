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
      withCredentials: true
    });
  }

  listFiles(path: string, location: string) {
    const body = {
      path,
      location,
    };

    return this.http.post<FileCard[]>(`${this.baseUrl}`, body, { withCredentials: true });
  }

  createFolder(folder: string, path: string) {
    const body = {
      folder,
      path,
    };

    return this.http.post(`${this.baseUrl}/folder`, body, { withCredentials: true });
  }

  deleteFile(file: FileCard) {
    return this.http.post(`${this.baseUrl}/delete`, file, { withCredentials: true });
  }

  downloadFile(file: FileCard) {
    const body = {
      file: file._id,
    };

    return this.http.post(`${this.baseUrl}/download`, body, {
      observe: 'response',
      responseType: 'blob',
      withCredentials: true,
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
