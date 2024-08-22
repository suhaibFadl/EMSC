import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncommingPatientsComponent } from './incomming-patients.component';

describe('IncommingPatientsComponent', () => {
  let component: IncommingPatientsComponent;
  let fixture: ComponentFixture<IncommingPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncommingPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncommingPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
