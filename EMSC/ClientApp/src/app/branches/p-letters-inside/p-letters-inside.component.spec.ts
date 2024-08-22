import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLettersInsideComponent } from './p-letters-inside.component';

describe('PLettersInsideComponent', () => {
  let component: PLettersInsideComponent;
  let fixture: ComponentFixture<PLettersInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLettersInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLettersInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
