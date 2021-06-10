import { NgModule, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list'
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { FileCardComponent } from './home/components/file-card/file-card.component';
import { FileExplorerComponent } from './home/components/file-explorer/file-explorer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadFileDialogComponent } from './home/modals/upload-file-dialog/upload-file-dialog.component';
import { NewFolderDialogComponent } from './home/modals/new-folder-dialog/new-folder-dialog.component';
import { ShareWithDialogComponent } from './home/modals/share-with-dialog/share-with-dialog.component';
import { AuthModule } from './auth/auth/auth.module';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    FileCardComponent,
    FileExplorerComponent,
    UploadFileDialogComponent,
    NewFolderDialogComponent,
    ShareWithDialogComponent,
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
    MatMenuModule,
    MatListModule,
    NgxMatFileInputModule,
    ToastrModule.forRoot(),
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
