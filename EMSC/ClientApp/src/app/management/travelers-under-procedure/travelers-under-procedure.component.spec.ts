import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersUnderProcedureComponent } from './travelers-under-procedure.component';

describe('TravelersUnderProcedureComponent', () => {
  let component: TravelersUnderProcedureComponent;
  let fixture: ComponentFixture<TravelersUnderProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelersUnderProcedureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelersUnderProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
