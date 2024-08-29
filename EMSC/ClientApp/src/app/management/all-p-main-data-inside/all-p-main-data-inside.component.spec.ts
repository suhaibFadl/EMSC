import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPMainDataInsideComponent } from './all-p-main-data-inside.component';

describe('AllPMainDataInsideComponent', () => {
  let component: AllPMainDataInsideComponent;
  let fixture: ComponentFixture<AllPMainDataInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPMainDataInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPMainDataInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
