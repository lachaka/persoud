import { Component, OnInit, Input } from '@angular/core';
import { FileCard } from '../../models/file'

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css']
})
export class FileCardComponent implements OnInit {
  @Input() file: FileCard;

  constructor() { }

  ngOnInit(): void {
  }

}
