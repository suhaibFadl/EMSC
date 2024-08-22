import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyInsideComponent } from './reply-inside.component';

describe('ReplyInsideComponent', () => {
  let component: ReplyInsideComponent;
  let fixture: ComponentFixture<ReplyInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
