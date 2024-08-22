import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatReportComponent } from './pat-report.component';

describe('PatReportComponent', () => {
  let component: PatReportComponent;
  let fixture: ComponentFixture<PatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
