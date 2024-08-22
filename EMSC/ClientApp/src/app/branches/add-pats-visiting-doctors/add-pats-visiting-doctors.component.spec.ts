import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatsVisitingDoctorsComponent } from './add-pats-visiting-doctors.component';

describe('AddPatsVisitingDoctorsComponent', () => {
  let component: AddPatsVisitingDoctorsComponent;
  let fixture: ComponentFixture<AddPatsVisitingDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatsVisitingDoctorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatsVisitingDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
