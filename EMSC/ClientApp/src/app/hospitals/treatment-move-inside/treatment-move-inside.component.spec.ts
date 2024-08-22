import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentMoveInsideComponent } from './treatment-move-inside.component';

describe('TreatmentMoveInsideComponent', () => {
  let component: TreatmentMoveInsideComponent;
  let fixture: ComponentFixture<TreatmentMoveInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentMoveInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentMoveInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
