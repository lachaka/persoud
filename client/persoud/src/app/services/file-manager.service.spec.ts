import { TestBed } from '@angular/core/testing';

import { FileManagerService } from './file-manager.service';

describe('UploadFilesService', () => {
  let service: FileManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
