import { ShareWithDialogComponent } from '../../modals/share-with-dialog/share-with-dialog.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import * as fileSaver from 'file-saver-es';

import { FileCard } from '../../models/file';
import { NewFolderDialogComponent } from '../../modals/new-folder-dialog/new-folder-dialog.component';
import { UploadFileDialogComponent } from '../../modals/upload-file-dialog/upload-file-dialog.component';
import { FileManagerService } from '../../services/file-manager.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css'],
})
export class FileExplorerComponent implements OnInit {
  @Input()
  public resultGridList : Array<any> = [];

  public fileList: FileCard[];
  public path: string;
  private parrent: string[];
  private unsubscriber: Subscription[];

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public dialog: MatDialog,
    private fileService: FileManagerService
  ) {
    this.path = '/';
    this.parrent = [];
    this.fileList = [];
    this.unsubscriber = [];
  }

  ngOnInit(): void {
    this.unsubscriber.push(
      this.fileService
        .listFiles(this.path)
        .subscribe((files: FileCard[]) => {
          this.fileList = files
        })
    );
  }

  receiveSearch($event) {
    this.unsubscriber.push(
      this.fileService.search($event).subscribe((files: FileCard[]) => {
        if (files) {
          this.fileList =files;
        }
      })
    );
  }

  ngOnDestroy() {
    this.unsubscriber.forEach((sub) => sub.unsubscribe());
  }

  openUploadDialog() {
    const data = {
      data: {
        uploadService: this.fileService,
        path: this.path,
      },
    };

    const dialogRef = this.dialog.open(UploadFileDialogComponent, data);

    this.unsubscriber.push(
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          res.forEach((file) => {
            this.fileList.push(file);
          });
        }
      })
    );
  }

  createFolderDialog() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent);

    this.unsubscriber.push(
      dialogRef.afterClosed().subscribe((folder: string) => {
        if (folder.length > 0) {
          this.unsubscriber.push(
            this.fileService.createFolder(folder, this.path).subscribe(
              (res: FileCard) => {
                this.fileList.push(res);
              },
              (error) => {
                console.log(error);
              }
            )
          );
        }
      })
    );
  }

  forward(dir: string): void {
    this.parrent.push(dir);
    this.path += dir + '/';

    this.unsubscriber.push(
      this.fileService
        .listFiles(this.path)
        .subscribe((files) => (this.fileList = files))
    );
  }

  backward(): void {
    if (this.path.length > 1) {
      this.path = this.path.slice(0, -this.parrent.pop().length - 1);

      this.unsubscriber.push(
        this.fileService
          .listFiles(this.path)
          .subscribe((files) => (this.fileList = files))
      );
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
    const dialogRef = this.dialog.open(ShareWithDialogComponent);
  
    this.unsubscriber.push(
      dialogRef.afterClosed().subscribe((email: string) => {
        if (email.length > 0) {
          this.unsubscriber.push(
            this.fileService.shareFile(file._id, email).subscribe((res:any) => {
              if (res.success) {
                console.log('File shared successfully');
              } else {
                console.log('Error while sharing file');
              }
            })
          );
        }
      })
    );
  }

  onContextMenuDownload(file: FileCard) {
    this.unsubscriber.push(
      this.fileService.downloadFile(file)
        .subscribe(res => {
          const contentDisposition = res.headers.get('content-disposition');
          const filename = file.isDir ? file.name + '.zip' : file.name;
          const blob: any = new Blob([res.body]);

          fileSaver.saveAs(blob, filename);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  onContextMenuRemove(file) {
    this.unsubscriber.push(
      this.fileService.deleteFile(file.id).subscribe(() => {
        this.fileList = this.fileList.filter((f) => f._id !== file._id);
      })
    );
  }

  sortBy(value: string) {
    if (value == 'name') {
      this.fileList.sort((f1, f2) => f1.name.localeCompare(f2.name));
    }
    if (value == 'size') {
      this.fileList = this.fileList.sort((f1, f2) => f1.size_bytes - f2.size_bytes);
    }

    if (value == 'upload_time') {
      this.fileList = this.fileList.sort(
        (f1, f2) => f1.upload_time - f2.upload_time
      );
    }
  }

  myFiles(): void {
    this.path = '/';
    this.unsubscriber.push(
      this.fileService
        .listFiles(this.path)
        .subscribe((files: FileCard[]) => {
          this.fileList = files
        })
    );
  }

  sharedFiles(): void {
    this.unsubscriber.push(
      this.fileService
        .sharedFiles()
        .subscribe((files: FileCard[]) => {
          this.fileList = files
        })
    );
  }


  handleResults(searchObj) {
    this.fileList = searchObj;
  }
}
