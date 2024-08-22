import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsHousingComponent } from './patients-housing.component';

describe('PatientsHousingComponent', () => {
  let component: PatientsHousingComponent;
  let fixture: ComponentFixture<PatientsHousingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsHousingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsHousingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
