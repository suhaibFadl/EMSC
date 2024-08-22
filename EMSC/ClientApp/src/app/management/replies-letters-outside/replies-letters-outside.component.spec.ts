import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesLettersOutsideComponent } from './replies-letters-outside.component';

describe('RepliesLettersOutsideComponent', () => {
  let component: RepliesLettersOutsideComponent;
  let fixture: ComponentFixture<RepliesLettersOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepliesLettersOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesLettersOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
