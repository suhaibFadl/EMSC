import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingRequestsComponent } from './waiting-requests.component';

describe('WaitingRequestsComponent', () => {
  let component: WaitingRequestsComponent;
  let fixture: ComponentFixture<WaitingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
