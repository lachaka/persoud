import { Component } from '@angular/core';
import { FileCard } from './models/file';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'persoud';

  files: FileCard[];

  constructor() {
    this.files = [];
  }

  ngOnInit() {let file: FileCard = new FileCard();
    file.id = 1;
    file.name = "file_name";
    file.type = "file";

    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
    this.files.push(file);
  }
}
