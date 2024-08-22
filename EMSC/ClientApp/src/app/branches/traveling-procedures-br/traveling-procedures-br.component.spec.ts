import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingProceduresBrComponent } from './traveling-procedures-br.component';

describe('TravelingProceduresBrComponent', () => {
  let component: TravelingProceduresBrComponent;
  let fixture: ComponentFixture<TravelingProceduresBrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelingProceduresBrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelingProceduresBrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
