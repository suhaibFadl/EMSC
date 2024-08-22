import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsTransferComponent } from './patients-transfer.component';

describe('PatientsTransferComponent', () => {
  let component: PatientsTransferComponent;
  let fixture: ComponentFixture<PatientsTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
