import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClosingFilesComponent } from './all-closing-files.component';

describe('AllClosingFilesComponent', () => {
  let component: AllClosingFilesComponent;
  let fixture: ComponentFixture<AllClosingFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllClosingFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllClosingFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
