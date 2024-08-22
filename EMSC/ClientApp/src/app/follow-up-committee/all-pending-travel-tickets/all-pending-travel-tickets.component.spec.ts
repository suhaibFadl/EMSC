import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingTravelTicketsComponent } from './all-pending-travel-tickets.component';

describe('AllPendingTravelTicketsComponent', () => {
  let component: AllPendingTravelTicketsComponent;
  let fixture: ComponentFixture<AllPendingTravelTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPendingTravelTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPendingTravelTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
