import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHotelsProceduresComponent } from './all-hotels-procedures.component';

describe('AllHotelsProceduresComponent', () => {
  let component: AllHotelsProceduresComponent;
  let fixture: ComponentFixture<AllHotelsProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllHotelsProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHotelsProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
