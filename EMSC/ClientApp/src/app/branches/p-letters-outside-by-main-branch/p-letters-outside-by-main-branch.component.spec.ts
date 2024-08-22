import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLettersOutsideByMainBranchComponent } from './p-letters-outside-by-main-branch.component';

describe('PLettersOutsideByMainBranchComponent', () => {
  let component: PLettersOutsideByMainBranchComponent;
  let fixture: ComponentFixture<PLettersOutsideByMainBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLettersOutsideByMainBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLettersOutsideByMainBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
