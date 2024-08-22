import { TestBed } from '@angular/core/testing';

import { HospitalCountryService } from './hospital-country.service';

describe('HospitalCountryService', () => {
  let service: HospitalCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
