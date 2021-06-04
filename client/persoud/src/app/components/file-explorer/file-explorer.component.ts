import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import * as fileSaver from 'file-saver-es';

import { FileCard } from '../../models/file';
import { NewFolderDialogComponent } from './../../dialogs/new-folder-dialog/new-folder-dialog.component';
import { UploadFileDialogComponent } from '../../dialogs/upload-file-dialog/upload-file-dialog.component';
import { FileManagerService } from '../../services/file-manager.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css'],
})
export class FileExplorerComponent implements OnInit {
  path: string = '/';
  location: string = 'cloud';
  parrent: string[] = [];
  fileList: FileCard[] = [];
  fileManagerSub: Subscription | undefined;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public dialog: MatDialog,
    private fileService: FileManagerService
  ) {}

  ngOnInit(): void {
    this.fileManagerSub = this.fileService
      .listFiles(this.path, this.location)
      .subscribe((files) => (this.fileList = files));
  }

  ngOnDestroy() {
    if (this.fileManagerSub) {
      this.fileManagerSub.unsubscribe();
    }
  }

  openUploadDialog() {
    const data = {
      data: {
        uploadService: this.fileService,
        path: this.path,
      },
    };

    let dialogRef = this.dialog.open(UploadFileDialogComponent, data);

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('add new files to the list');
      }
    });
  }

  createFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);

    dialogRef.afterClosed().subscribe((folder: string) => {
      console.log(folder);
      if (folder.length > 0) {
        this.fileService.createFolder(folder, this.path).subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          },
          () => {
            this.fileList.push({
              name: folder,
              path: this.path,
              size: 0,
              isDir: true,
            });
          }
        );
      }
    });
  }

  forward(dir: string): void {
    this.parrent.push(dir);
    this.path += dir + '/';
    this.fileManagerSub = this.fileService
      .listFiles(this.path, this.location)
      .subscribe((files) => (this.fileList = files));
  }

  backward(): void {
    if (this.path.length > 1) {
      this.path = this.path.slice(0, -this.parrent.pop().length - 1);

      this.fileManagerSub = this.fileService
        .listFiles(this.path, this.location)
        .subscribe((files) => (this.fileList = files));
    }
  }

  trackByName(index, file: FileCard) {
    return index;
  }

  onRightClick(event: MouseEvent, file: FileCard) {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { file: file };
    this.contextMenu.openMenu();
  }

  onContextMenuShare(file: FileCard) {
    console.log(file);
  }

  onContextMenuDownload(file: FileCard) {
    this.fileService.downloadFile(file).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const filename = contentDisposition.split(';')[1].split('=')[1].trim();
      const blob: any = new Blob([res.body]);
      
      fileSaver.saveAs(blob, filename);
    }, err => {
      console.log(err);
    });
  }

  onContextMenuRemove(file: FileCard) {
    this.fileManagerSub = this.fileService.deleteFile(file).subscribe(() => {
      this.fileList = this.fileList.filter((f) => f.name !== file.name);
    });
  }

  myFiles(): void {}

  sharedFiles(): void {}
}
