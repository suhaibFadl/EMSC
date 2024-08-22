import { TestBed } from '@angular/core/testing';

import { PatientsMainDataService } from './patients-main-data.service';

describe('PatientsMainDataService', () => {
  let service: PatientsMainDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsMainDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
