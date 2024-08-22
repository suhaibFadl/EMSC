import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyReportsComponent } from './pharmacy-reports.component';

describe('PharmacyReportsComponent', () => {
  let component: PharmacyReportsComponent;
  let fixture: ComponentFixture<PharmacyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
