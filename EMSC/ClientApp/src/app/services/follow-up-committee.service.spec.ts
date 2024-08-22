import { TestBed } from '@angular/core/testing';

import { FollowUpCommitteeService } from './follow-up-committee.service';

describe('FollowUpCommitteeService', () => {
  let service: FollowUpCommitteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowUpCommitteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
