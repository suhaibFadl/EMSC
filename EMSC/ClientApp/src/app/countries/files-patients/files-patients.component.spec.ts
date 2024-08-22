import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPatientsComponent } from './files-patients.component';

describe('FilesPatientsComponent', () => {
  let component: FilesPatientsComponent;
  let fixture: ComponentFixture<FilesPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
