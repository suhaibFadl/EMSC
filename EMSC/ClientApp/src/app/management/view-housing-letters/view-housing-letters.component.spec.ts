import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHousingLettersComponent } from './view-housing-letters.component';

describe('ViewHousingLettersComponent', () => {
  let component: ViewHousingLettersComponent;
  let fixture: ComponentFixture<ViewHousingLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHousingLettersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHousingLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
