import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesLettersInsideComponent } from './replies-letters-inside.component';

describe('RepliesLettersInsideComponent', () => {
  let component: RepliesLettersInsideComponent;
  let fixture: ComponentFixture<RepliesLettersInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepliesLettersInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesLettersInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
