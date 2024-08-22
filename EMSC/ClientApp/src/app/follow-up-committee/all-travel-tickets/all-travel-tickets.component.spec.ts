import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTravelTicketsComponent } from './all-travel-tickets.component';

describe('AllTravelTicketsComponent', () => {
  let component: AllTravelTicketsComponent;
  let fixture: ComponentFixture<AllTravelTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTravelTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTravelTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
