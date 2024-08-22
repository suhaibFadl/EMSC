import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsInCountriesComponent } from './patients-in-countries.component';

describe('PatientsInCountriesComponent', () => {
  let component: PatientsInCountriesComponent;
  let fixture: ComponentFixture<PatientsInCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsInCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsInCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
