import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialOffersComponent } from './initial-offers.component';

describe('InitialOffersComponent', () => {
  let component: InitialOffersComponent;
  let fixture: ComponentFixture<InitialOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
