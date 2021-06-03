import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { FileCard } from '../models/file'

@Injectable({
  providedIn: 'root'
})

export class UploadFilesService {
  private baseUrl = 'http://localhost:3000/files';

  constructor(private http: HttpClient) { }

  upload(file: File, path: string) {
    const formData: FormData = new FormData();
    formData.append('path', path);
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    });
  }

  getFiles(path: string, location: string) {
    const body = {
      path,
      location
    };
    
    return this.http.post<FileCard[]>(`${this.baseUrl}`, body);
  }

  createFolder(folder: string, path: string) {
    const body = {
      folder,
      path
    }
    
    return this.http.post(`${this.baseUrl}/folder`, body);
  }
}
