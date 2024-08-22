import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPatsInsideComponent } from './files-pats-inside.component';

describe('FilesPatsInsideComponent', () => {
  let component: FilesPatsInsideComponent;
  let fixture: ComponentFixture<FilesPatsInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesPatsInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPatsInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
