import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentBranchComponent } from './treatment-branch.component';

describe('TreatmentBranchComponent', () => {
  let component: TreatmentBranchComponent;
  let fixture: ComponentFixture<TreatmentBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
