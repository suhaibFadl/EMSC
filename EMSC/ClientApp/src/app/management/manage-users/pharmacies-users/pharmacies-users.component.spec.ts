import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaciesUsersComponent } from './pharmacies-users.component';

describe('PharmaciesUsersComponent', () => {
  let component: PharmaciesUsersComponent;
  let fixture: ComponentFixture<PharmaciesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaciesUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaciesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
