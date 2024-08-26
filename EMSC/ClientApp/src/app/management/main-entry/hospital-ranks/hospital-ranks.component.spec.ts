import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRanksComponent } from './hospital-ranks.component';

describe('HospitalRanksComponent', () => {
  let component: HospitalRanksComponent;
  let fixture: ComponentFixture<HospitalRanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalRanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
