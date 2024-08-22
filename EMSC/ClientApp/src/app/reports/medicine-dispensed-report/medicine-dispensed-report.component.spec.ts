import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineDispensedReportComponent } from './medicine-dispensed-report.component';

describe('MedicineDispensedReportComponent', () => {
  let component: MedicineDispensedReportComponent;
  let fixture: ComponentFixture<MedicineDispensedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineDispensedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineDispensedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
