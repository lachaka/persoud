import { NewFolderDialogComponent } from './../../dialogs/new-folder-dialog/new-folder-dialog.component';
import { UploadFileDialogComponent } from '../../dialogs/upload-file-dialog/upload-file-dialog.component';
import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, JsonpClientBackend } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { FileCard } from '../../models/file';
import { UploadFilesService } from './../../services/upload-files.service';


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

    let dialogRef = this.dialog.open(UploadFileDialogComponent, data);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {  
        console.log("add new files to the list");
      }
    });
  }

  createFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);

    dialogRef.afterClosed().subscribe((folder: string) => {
      console.log(folder);
      if (folder.length > 0) {
        this.uploadService.createFolder(folder, this.path).subscribe(res => {
          console.log(res);
        }, error => {
          console.log(error);
        }, () => {
          this.fileList.push({ name: folder, path: this.path, size: 0, isDir: true});
        });
      }
    });
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

  trackByName(index, file) {
    return index;
  }
}
