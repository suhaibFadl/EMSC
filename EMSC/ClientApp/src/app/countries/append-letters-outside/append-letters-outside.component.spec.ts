import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendLettersOutsideComponent } from './append-letters-outside.component';

describe('AppendLettersOutsideComponent', () => {
  let component: AppendLettersOutsideComponent;
  let fixture: ComponentFixture<AppendLettersOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppendLettersOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendLettersOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
