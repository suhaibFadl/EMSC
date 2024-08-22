import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPatExistComponent } from './check-pat-exist.component';

describe('CheckPatExistComponent', () => {
  let component: CheckPatExistComponent;
  let fixture: ComponentFixture<CheckPatExistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckPatExistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPatExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
