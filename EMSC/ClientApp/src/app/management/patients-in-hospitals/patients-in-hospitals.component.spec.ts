import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsInHospitalsComponent } from './patients-in-hospitals.component';

describe('PatientsInHospitalsComponent', () => {
  let component: PatientsInHospitalsComponent;
  let fixture: ComponentFixture<PatientsInHospitalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsInHospitalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsInHospitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
