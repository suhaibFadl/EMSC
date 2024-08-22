import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingBackTicketsComponent } from './all-pending-back-tickets.component';

describe('AllPendingBackTicketsComponent', () => {
  let component: AllPendingBackTicketsComponent;
  let fixture: ComponentFixture<AllPendingBackTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPendingBackTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPendingBackTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
