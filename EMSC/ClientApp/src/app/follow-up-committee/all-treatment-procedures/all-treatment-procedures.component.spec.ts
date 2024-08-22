import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTreatmentProceduresComponent } from './all-treatment-procedures.component';

describe('AllTreatmentProceduresComponent', () => {
  let component: AllTreatmentProceduresComponent;
  let fixture: ComponentFixture<AllTreatmentProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTreatmentProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTreatmentProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
