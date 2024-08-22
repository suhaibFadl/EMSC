import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHousingLettersComponent } from './add-housing-letters.component';

describe('AddHousingLettersComponent', () => {
  let component: AddHousingLettersComponent;
  let fixture: ComponentFixture<AddHousingLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHousingLettersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHousingLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
