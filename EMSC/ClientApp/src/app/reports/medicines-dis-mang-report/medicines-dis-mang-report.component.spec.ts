import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesDisMangReportComponent } from './medicines-dis-mang-report.component';

describe('MedicinesDisMangReportComponent', () => {
  let component: MedicinesDisMangReportComponent;
  let fixture: ComponentFixture<MedicinesDisMangReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicinesDisMangReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinesDisMangReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
