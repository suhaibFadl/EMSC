import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalservicesComponent } from './medicalservices.component';

describe('MedicalservicesComponent', () => {
  let component: MedicalservicesComponent;
  let fixture: ComponentFixture<MedicalservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalservicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
