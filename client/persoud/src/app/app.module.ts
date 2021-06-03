import { NgModule, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { AppComponent } from './app.component';
import { FileCardComponent } from './components/file-card/file-card.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadFileDialogComponent } from './dialogs/upload-file-dialog/upload-file-dialog.component';
import { NewFolderDialogComponent } from './dialogs/new-folder-dialog/new-folder-dialog.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    FileCardComponent,
    FileExplorerComponent,
    UploadFileDialogComponent,
    NewFolderDialogComponent
  ],
  entryComponents: [ 
    UploadFileDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatFileInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
