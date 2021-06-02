import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { FileCard } from '../../models/file';
import { UploadFilesService } from './../../services/upload-files.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})

export class FileExplorerComponent implements OnInit {
  path: string = '/';
  location: string = "cloud";
  parrent: string[] = [];
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileList: FileCard[] = [];
  uploadSub: Subscription | undefined;
  
  constructor(private uploadService: UploadFilesService) {
  }

  ngOnInit(): void {
    this.uploadSub = this.uploadService.getFiles(this.path, this.location)
                                .subscribe(files => this.fileList = files );
  }

  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }

  forward(dir: string): void {
    this.parrent.push(dir);
    this.path += dir + '/';
    this.uploadSub = this.uploadService.getFiles(this.path, this.location)
                                .subscribe(files => this.fileList = files );
  }

  backward(): void {
    if (this.path.length > 1) {
      this.path = this.path.slice(0, -this.parrent.pop().length - 1);

      this.uploadSub = this.uploadService.getFiles(this.path, this.location)
                                  .subscribe(files => this.fileList = files );
    }
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
              this.uploadSub = this.uploadService.getFiles(this.path, this.location)
                                          .subscribe(files => this.fileList = files );
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
