import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileCard } from '../models/file'

@Injectable({
  providedIn: 'root'
})

export class UploadFilesService {
  private baseUrl = 'http://localhost:3000/files';

  constructor(private http: HttpClient) { }

  upload(file: File, path: string) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    console.log("service");
    // const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });

    // return this.http.request(req);
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
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
}
