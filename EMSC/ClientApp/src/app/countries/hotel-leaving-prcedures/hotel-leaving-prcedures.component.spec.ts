import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelLeavingPrceduresComponent } from './hotel-leaving-prcedures.component';

describe('HotelLeavingPrceduresComponent', () => {
  let component: HotelLeavingPrceduresComponent;
  let fixture: ComponentFixture<HotelLeavingPrceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelLeavingPrceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelLeavingPrceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
