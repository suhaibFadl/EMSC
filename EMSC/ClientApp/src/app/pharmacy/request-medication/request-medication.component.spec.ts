import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMedicationComponent } from './request-medication.component';

describe('RequestMedicationComponent', () => {
  let component: RequestMedicationComponent;
  let fixture: ComponentFixture<RequestMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMedicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
