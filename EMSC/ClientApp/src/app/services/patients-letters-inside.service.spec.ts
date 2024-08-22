import { TestBed } from '@angular/core/testing';

import { PatientsLettersInsideService } from './patients-letters-inside.service';

describe('PatientsLettersInsideService', () => {
  let service: PatientsLettersInsideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsLettersInsideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
