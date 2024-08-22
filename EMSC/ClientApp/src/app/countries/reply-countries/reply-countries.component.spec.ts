import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyCountriesComponent } from './reply-countries.component';

describe('ReplyCountriesComponent', () => {
  let component: ReplyCountriesComponent;
  let fixture: ComponentFixture<ReplyCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
