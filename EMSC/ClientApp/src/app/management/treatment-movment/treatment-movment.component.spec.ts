import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentMovmentComponent } from './treatment-movment.component';

describe('TreatmentMovmentComponent', () => {
  let component: TreatmentMovmentComponent;
  let fixture: ComponentFixture<TreatmentMovmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentMovmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentMovmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
