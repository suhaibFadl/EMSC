import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsOutsideComponent } from './hotels-outside.component';

describe('HotelsOutsideComponent', () => {
  let component: HotelsOutsideComponent;
  let fixture: ComponentFixture<HotelsOutsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsOutsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsOutsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
