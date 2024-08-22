import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineReportComponent } from './medicine-report.component';

describe('MedicineReportComponent', () => {
  let component: MedicineReportComponent;
  let fixture: ComponentFixture<MedicineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
