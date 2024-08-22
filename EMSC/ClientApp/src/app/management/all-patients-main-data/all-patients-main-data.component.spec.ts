import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPatientsMainDataComponent } from './all-patients-main-data.component';

describe('AllPatientsMainDataComponent', () => {
  let component: AllPatientsMainDataComponent;
  let fixture: ComponentFixture<AllPatientsMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPatientsMainDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPatientsMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
