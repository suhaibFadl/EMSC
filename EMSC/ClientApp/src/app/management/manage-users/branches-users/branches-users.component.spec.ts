import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesUsersComponent } from './branches-users.component';

describe('BranchesUsersComponent', () => {
  let component: BranchesUsersComponent;
  let fixture: ComponentFixture<BranchesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchesUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
