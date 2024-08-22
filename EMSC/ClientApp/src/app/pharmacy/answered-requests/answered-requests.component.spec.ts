import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweredRequestsComponent } from './answered-requests.component';

describe('AnsweredRequestsComponent', () => {
  let component: AnsweredRequestsComponent;
  let fixture: ComponentFixture<AnsweredRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnsweredRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweredRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
