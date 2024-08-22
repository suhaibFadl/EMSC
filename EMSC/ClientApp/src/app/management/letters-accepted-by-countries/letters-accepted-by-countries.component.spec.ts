import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersAcceptedByCountriesComponent } from './letters-accepted-by-countries.component';

describe('LettersAcceptedByCountriesComponent', () => {
  let component: LettersAcceptedByCountriesComponent;
  let fixture: ComponentFixture<LettersAcceptedByCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LettersAcceptedByCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersAcceptedByCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
