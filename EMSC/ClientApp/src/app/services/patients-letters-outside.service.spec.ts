import { TestBed } from '@angular/core/testing';

import { PatientsLettersOutsideService } from './patients-letters-outside.service';

describe('PatientsLettersOutsideService', () => {
  let service: PatientsLettersOutsideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsLettersOutsideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
