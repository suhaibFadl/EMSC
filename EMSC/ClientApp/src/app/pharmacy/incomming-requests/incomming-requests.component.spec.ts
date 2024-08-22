import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncommingRequestsComponent } from './incomming-requests.component';

describe('IncommingRequestsComponent', () => {
  let component: IncommingRequestsComponent;
  let fixture: ComponentFixture<IncommingRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncommingRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncommingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
