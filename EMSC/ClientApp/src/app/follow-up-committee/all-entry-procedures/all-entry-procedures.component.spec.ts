import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEntryProceduresComponent } from './all-entry-procedures.component';

describe('AllEntryProceduresComponent', () => {
  let component: AllEntryProceduresComponent;
  let fixture: ComponentFixture<AllEntryProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEntryProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEntryProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
