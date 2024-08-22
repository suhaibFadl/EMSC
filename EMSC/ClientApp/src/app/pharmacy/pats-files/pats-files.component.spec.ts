import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatsFilesComponent } from './pats-files.component';

describe('PatsFilesComponent', () => {
  let component: PatsFilesComponent;
  let fixture: ComponentFixture<PatsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatsFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
