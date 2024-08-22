import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersOutsideIncomingComponent } from './letters-outside-incoming.component';

describe('LettersOutsideIncomingComponent', () => {
  let component: LettersOutsideIncomingComponent;
  let fixture: ComponentFixture<LettersOutsideIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LettersOutsideIncomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersOutsideIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
