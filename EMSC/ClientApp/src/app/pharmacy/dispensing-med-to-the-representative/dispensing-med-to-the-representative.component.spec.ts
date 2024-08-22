import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispensingMedToTheRepresentativeComponent } from './dispensing-med-to-the-representative.component';

describe('DispensingMedToTheRepresentativeComponent', () => {
  let component: DispensingMedToTheRepresentativeComponent;
  let fixture: ComponentFixture<DispensingMedToTheRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispensingMedToTheRepresentativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensingMedToTheRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
