import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersInsideIncomingComponent } from './letters-inside-incoming.component';

describe('LettersInsideIncomingComponent', () => {
  let component: LettersInsideIncomingComponent;
  let fixture: ComponentFixture<LettersInsideIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LettersInsideIncomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersInsideIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
