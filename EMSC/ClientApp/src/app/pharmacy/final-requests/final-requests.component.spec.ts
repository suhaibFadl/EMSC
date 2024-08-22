import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalRequestsComponent } from './final-requests.component';

describe('FinalRequestsComponent', () => {
  let component: FinalRequestsComponent;
  let fixture: ComponentFixture<FinalRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
