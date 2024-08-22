import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsUsersComponent } from './clinics-users.component';

describe('ClinicsUsersComponent', () => {
  let component: ClinicsUsersComponent;
  let fixture: ComponentFixture<ClinicsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicsUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
