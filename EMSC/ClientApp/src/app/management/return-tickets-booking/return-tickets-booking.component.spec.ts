import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnTicketsBookingComponent } from './return-tickets-booking.component';

describe('ReturnTicketsBookingComponent', () => {
  let component: ReturnTicketsBookingComponent;
  let fixture: ComponentFixture<ReturnTicketsBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnTicketsBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnTicketsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
