import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { FileExplorerComponent } from './home/components/file-explorer/file-explorer.component';

const routes: Routes = [
  { path: 'home', component: FileExplorerComponent },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
