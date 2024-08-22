import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsLeavingProceduresComponent } from './hotels-leaving-procedures.component';

describe('HotelsLeavingProceduresComponent', () => {
  let component: HotelsLeavingProceduresComponent;
  let fixture: ComponentFixture<HotelsLeavingProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsLeavingProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsLeavingProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
