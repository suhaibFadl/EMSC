import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingProceduresComponent } from './traveling-procedures.component';

describe('TravelingProceduresComponent', () => {
  let component: TravelingProceduresComponent;
  let fixture: ComponentFixture<TravelingProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelingProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
