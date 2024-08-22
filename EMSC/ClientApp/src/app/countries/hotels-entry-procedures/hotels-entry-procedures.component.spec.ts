import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsEntryProceduresComponent } from './hotels-entry-procedures.component';

describe('HotelsEntryProceduresComponent', () => {
  let component: HotelsEntryProceduresComponent;
  let fixture: ComponentFixture<HotelsEntryProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsEntryProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsEntryProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
