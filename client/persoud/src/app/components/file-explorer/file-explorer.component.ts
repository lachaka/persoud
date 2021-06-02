import { UploadFileDialogComponent } from './../upload-file-dialog/upload-file-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
  fileList: FileCard[] = [];
  uploadSub: Subscription | undefined;
  
  constructor(public dialog: MatDialog, private uploadService: UploadFilesService) {}

  ngOnInit(): void {
    this.uploadSub = this.uploadService.getFiles(this.path, this.location)
                                .subscribe(files => this.fileList = files );
  }

  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }

  openUploadDialog() {
    const data = { 
      data: {
        uploadService: this.uploadService,
        path: this.path
      }
    };

    this.dialog.open(UploadFileDialogComponent, data);
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
}
