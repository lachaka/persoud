import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FileCard } from '../../models/file';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css'],
})
export class UploadFileDialogComponent implements OnInit {
  multiple: boolean = true;
  files: File[];
  progressInfos: any[];
  unsubscriber: Subscription[];
  selectedFiles: FormControl;
  responseFiles: FileCard[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedFiles = new FormControl(this.files);
    this.files = [];
    this.progressInfos = [];
    this.unsubscriber = [];
    this.responseFiles = [];
  }

  ngOnInit(): void {
    this.unsubscriber.push(
      this.selectedFiles.valueChanges.subscribe((files: any) => {
        if (!Array.isArray(files)) {
          this.files = [files];
        } else {
          this.files = files;
        }
      })
    );
  }

  ngOnDestory() {
    this.unsubscriber.forEach((sub) => sub.unsubscribe());
  }

  uploadFiles(): void {
    if (this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        this.upload(i, this.files[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.unsubscriber.push(
        this.data.uploadService.upload(file, this.data.path).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressInfos[idx].value = Math.round(
                (100 * event.loaded) / event.total
              );
            } else if (event instanceof HttpResponse) {
              this.responseFiles.push(event.body);
            }
          },
          (err: any) => {
            this.progressInfos[idx].value = 0;
            const msg = 'Could not upload the file: ' + file.name;
          }
        )
      );
    }
  }

  removeFileUpload(file) {
    this.files = this.files.filter(f => f != file);
  }

  trackById(index) {
    return index;
  }

}
