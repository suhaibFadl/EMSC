import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLettersOutsideComponent } from './p-letters-outside.component';

describe('PLettersOutsideComponent', () => {
  let component: PLettersOutsideComponent;
  let fixture: ComponentFixture<PLettersOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLettersOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLettersOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
