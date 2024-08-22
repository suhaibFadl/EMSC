import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMainDataComponent } from './p-main-data.component';

describe('PMainDataComponent', () => {
  let component: PMainDataComponent;
  let fixture: ComponentFixture<PMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PMainDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
