import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispenseMedicationComponent } from './dispense-medication.component';

describe('DispenseMedicationComponent', () => {
  let component: DispenseMedicationComponent;
  let fixture: ComponentFixture<DispenseMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispenseMedicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispenseMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
