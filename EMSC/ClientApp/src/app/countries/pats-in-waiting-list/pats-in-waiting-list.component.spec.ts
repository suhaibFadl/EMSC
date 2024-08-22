import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatsInWaitingListComponent } from './pats-in-waiting-list.component';

describe('PatsInWaitingListComponent', () => {
  let component: PatsInWaitingListComponent;
  let fixture: ComponentFixture<PatsInWaitingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatsInWaitingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatsInWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
