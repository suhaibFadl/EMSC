import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPatInCountriesComponent } from './all-pat-in-countries.component';

describe('AllPatInCountriesComponent', () => {
  let component: AllPatInCountriesComponent;
  let fixture: ComponentFixture<AllPatInCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPatInCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPatInCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
