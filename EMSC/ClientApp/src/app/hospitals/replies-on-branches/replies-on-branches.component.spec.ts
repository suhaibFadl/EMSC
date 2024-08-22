import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesOnBranchesComponent } from './replies-on-branches.component';

describe('RepliesOnBranchesComponent', () => {
  let component: RepliesOnBranchesComponent;
  let fixture: ComponentFixture<RepliesOnBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepliesOnBranchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesOnBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
