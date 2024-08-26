import { TestBed } from '@angular/core/testing';

import { HospitalRanksService } from './hospital-ranks.service';

describe('HospitalRanksService', () => {
  let service: HospitalRanksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalRanksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
