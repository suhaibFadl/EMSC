import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRenewalsByHotelEntryIdComponent } from './all-renewals-by-hotel-entry-id.component';

describe('AllRenewalsByHotelEntryIdComponent', () => {
  let component: AllRenewalsByHotelEntryIdComponent;
  let fixture: ComponentFixture<AllRenewalsByHotelEntryIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRenewalsByHotelEntryIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRenewalsByHotelEntryIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
