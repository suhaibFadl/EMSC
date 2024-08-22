import { TestBed } from '@angular/core/testing';

import { ReplyHospitalService } from './reply-hospital.service';

describe('ReplyHospitalService', () => {
  let service: ReplyHospitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyHospitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
