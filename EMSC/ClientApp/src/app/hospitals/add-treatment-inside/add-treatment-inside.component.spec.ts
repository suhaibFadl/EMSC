import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatmentInsideComponent } from './add-treatment-inside.component';

describe('AddTreatmentInsideComponent', () => {
  let component: AddTreatmentInsideComponent;
  let fixture: ComponentFixture<AddTreatmentInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTreatmentInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTreatmentInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
