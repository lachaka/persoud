import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWithDialogComponent } from './share-with-dialog.component';

describe('ShareWithDialogComponent', () => {
  let component: ShareWithDialogComponent;
  let fixture: ComponentFixture<ShareWithDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareWithDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWithDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
