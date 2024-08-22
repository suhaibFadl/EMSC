import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainBranchUsersComponent } from './main-branch-users.component';

describe('MainBranchUsersComponent', () => {
  let component: MainBranchUsersComponent;
  let fixture: ComponentFixture<MainBranchUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainBranchUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainBranchUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
