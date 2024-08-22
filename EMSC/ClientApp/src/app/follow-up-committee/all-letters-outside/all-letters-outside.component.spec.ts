import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLettersOutsideComponent } from './all-letters-outside.component';

describe('AllLettersOutsideComponent', () => {
  let component: AllLettersOutsideComponent;
  let fixture: ComponentFixture<AllLettersOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLettersOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLettersOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
