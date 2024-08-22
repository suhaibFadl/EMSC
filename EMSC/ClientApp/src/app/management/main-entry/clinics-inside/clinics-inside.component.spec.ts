import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsInsideComponent } from './clinics-inside.component';

describe('ClinicsInsideComponent', () => {
  let component: ClinicsInsideComponent;
  let fixture: ComponentFixture<ClinicsInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicsInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
