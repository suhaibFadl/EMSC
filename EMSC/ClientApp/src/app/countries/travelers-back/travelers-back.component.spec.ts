import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelersBackComponent } from './travelers-back.component';

describe('TravelersBackComponent', () => {
  let component: TravelersBackComponent;
  let fixture: ComponentFixture<TravelersBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelersBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelersBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
