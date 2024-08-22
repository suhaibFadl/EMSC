import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparedMedicationsComponent } from './prepared-medications.component';

describe('PreparedMedicationsComponent', () => {
  let component: PreparedMedicationsComponent;
  let fixture: ComponentFixture<PreparedMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparedMedicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparedMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
