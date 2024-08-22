import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrvelingProceduresBackComponent } from './trveling-procedures-back.component';

describe('TrvelingProceduresBackComponent', () => {
  let component: TrvelingProceduresBackComponent;
  let fixture: ComponentFixture<TrvelingProceduresBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrvelingProceduresBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrvelingProceduresBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
