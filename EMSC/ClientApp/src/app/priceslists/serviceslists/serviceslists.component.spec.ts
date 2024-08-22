import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceslistsComponent } from './serviceslists.component';

describe('ServiceslistsComponent', () => {
  let component: ServiceslistsComponent;
  let fixture: ComponentFixture<ServiceslistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceslistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceslistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
