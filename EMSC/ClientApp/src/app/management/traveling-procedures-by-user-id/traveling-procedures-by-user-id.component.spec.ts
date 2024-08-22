import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingProceduresByUserIdComponent } from './traveling-procedures-by-user-id.component';

describe('TravelingProceduresByUserIdComponent', () => {
  let component: TravelingProceduresByUserIdComponent;
  let fixture: ComponentFixture<TravelingProceduresByUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelingProceduresByUserIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingProceduresByUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
