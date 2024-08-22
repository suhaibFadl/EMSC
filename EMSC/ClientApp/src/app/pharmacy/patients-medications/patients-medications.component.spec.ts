import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsMedicationsComponent } from './patients-medications.component';

describe('PatientsMedicationsComponent', () => {
  let component: PatientsMedicationsComponent;
  let fixture: ComponentFixture<PatientsMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsMedicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
