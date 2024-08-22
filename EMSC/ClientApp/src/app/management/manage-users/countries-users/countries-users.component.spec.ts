import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesUsersComponent } from './countries-users.component';

describe('CountriesUsersComponent', () => {
  let component: CountriesUsersComponent;
  let fixture: ComponentFixture<CountriesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountriesUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
