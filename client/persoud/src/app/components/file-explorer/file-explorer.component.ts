import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileCard } from '../../models/file';
import { UploadFilesService } from './../../services/upload-files.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})

export class FileExplorerComponent implements OnInit {
  location: string = '/';
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileList: FileCard[] = [];

  constructor(private uploadService: UploadFilesService) {
  }

  ngOnInit(): void {
    this.uploadService.getFiles(this.location).subscribe(files => this.fileList = files );
  }

  forward(dir: string): void {
    this.location += dir + '/';
    this.uploadService.getFiles(this.location).subscribe(files => this.fileList = files );
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        console.log(this.currentFile);
        this.uploadService.upload(this.currentFile, this.location).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.uploadService.getFiles(this.location).subscribe(files => this.fileList = files );
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;

          });
      }
    }
    this.selectedFiles = undefined;
  }
}
