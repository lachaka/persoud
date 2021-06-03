import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {
  multiple: boolean = true;
  files: File[];
  progressInfos: any[];
  message: string[];

  selectedFiles: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedFiles = new FormControl(this.files); 
    this.files = [];
    this.progressInfos = [];
    this.message = [];
  }
  
  ngOnInit(): void {
    this.selectedFiles.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
    });
  }
/*
  selectFiles(event): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    console.log(event.target.files);
  }*/
  
  uploadFiles(): void {
    this.message = [];
    
    if (this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        this.upload(i, this.files[i]);
      }
    }
  }  

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    if (file) {
      this.data.uploadService.upload(file, this.data.path).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = '${file.name} has been uploaded successfully' + file.name;
            this.message.push(msg);
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }
      );
    }
  }
}
