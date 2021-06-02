import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileCard } from '../models/file'

@Injectable({
  providedIn: 'root'
})

export class UploadFilesService {
  private baseUrl = 'http://localhost:3000/files/';

  constructor(private http: HttpClient) { }

  upload(file: File, location: string) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload?path=${location}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(path: string, location: string) {
    const body = {
      path,
      location
    };
    
    return this.http.post<FileCard[]>(`${this.baseUrl}`, body);
  }
}
