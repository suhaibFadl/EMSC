import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsProvidedPatsComponent } from './medications-provided-pats.component';

describe('MedicationsProvidedPatsComponent', () => {
  let component: MedicationsProvidedPatsComponent;
  let fixture: ComponentFixture<MedicationsProvidedPatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicationsProvidedPatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationsProvidedPatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
