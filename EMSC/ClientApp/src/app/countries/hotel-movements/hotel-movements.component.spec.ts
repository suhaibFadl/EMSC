import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMovementsComponent } from './hotel-movements.component';

describe('HotelMovementsComponent', () => {
  let component: HotelMovementsComponent;
  let fixture: ComponentFixture<HotelMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelMovementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
