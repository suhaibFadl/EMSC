import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentMovementsComponent } from './treatment-movements.component';

describe('TreatmentMovementsComponent', () => {
  let component: TreatmentMovementsComponent;
  let fixture: ComponentFixture<TreatmentMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentMovementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
