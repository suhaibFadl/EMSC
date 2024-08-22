import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBackTicketsComponent } from './all-back-tickets.component';

describe('AllBackTicketsComponent', () => {
  let component: AllBackTicketsComponent;
  let fixture: ComponentFixture<AllBackTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBackTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBackTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
