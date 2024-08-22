import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesMainBranchAndCountriesComponent } from './replies-main-branch-and-countries.component';

describe('RepliesMainBranchAndCountriesComponent', () => {
  let component: RepliesMainBranchAndCountriesComponent;
  let fixture: ComponentFixture<RepliesMainBranchAndCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepliesMainBranchAndCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesMainBranchAndCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
