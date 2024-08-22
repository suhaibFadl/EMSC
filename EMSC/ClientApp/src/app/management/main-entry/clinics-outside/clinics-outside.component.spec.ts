import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsOutsideComponent } from './clinics-outside.component';

describe('ClinicsOutsideComponent', () => {
  let component: ClinicsOutsideComponent;
  let fixture: ComponentFixture<ClinicsOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicsOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
