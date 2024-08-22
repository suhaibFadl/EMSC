import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatMedDetailsComponent } from './pat-med-details.component';

describe('PatMedDetailsComponent', () => {
  let component: PatMedDetailsComponent;
  let fixture: ComponentFixture<PatMedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatMedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatMedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
