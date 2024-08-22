import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsListAcceptedComponent } from './patients-list-accepted.component';

describe('PatientsListAcceptedComponent', () => {
  let component: PatientsListAcceptedComponent;
  let fixture: ComponentFixture<PatientsListAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsListAcceptedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsListAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
