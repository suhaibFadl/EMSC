import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendPMainDataComponent } from './append-p-main-data.component';

describe('AppendPMainDataComponent', () => {
  let component: AppendPMainDataComponent;
  let fixture: ComponentFixture<AppendPMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppendPMainDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendPMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
