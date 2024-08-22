import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryEventsComponent } from './injury-events.component';

describe('InjuryEventsComponent', () => {
  let component: InjuryEventsComponent;
  let fixture: ComponentFixture<InjuryEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
