import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingEntryProceduresComponent } from './all-pending-entry-procedures.component';

describe('AllPendingEntryProceduresComponent', () => {
  let component: AllPendingEntryProceduresComponent;
  let fixture: ComponentFixture<AllPendingEntryProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPendingEntryProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPendingEntryProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
