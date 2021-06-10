import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from './../app-material/app-material.module';

import { FileCardComponent } from './components/file-card/file-card.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { UploadFileDialogComponent } from './modals/upload-file-dialog/upload-file-dialog.component';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { ShareWithDialogComponent } from './modals/share-with-dialog/share-with-dialog.component';
import { NavComponent } from './components/nav/nav.component';


@NgModule({
  declarations: [
    FileCardComponent,
    FileExplorerComponent,
    UploadFileDialogComponent,
    NewFolderDialogComponent,
    ShareWithDialogComponent,
    NavComponent,
  ],
  entryComponents: [
    UploadFileDialogComponent,
    NewFolderDialogComponent,
    ShareWithDialogComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule
  ]
})
export class HomeModule { }
