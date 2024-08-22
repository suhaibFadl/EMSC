import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLettersComponent } from './housing-letters.component';

describe('HousingLettersComponent', () => {
  let component: HousingLettersComponent;
  let fixture: ComponentFixture<HousingLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousingLettersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HousingLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
