import { TestBed } from '@angular/core/testing';

import { HousingLettersService } from './housing-letters.service';

describe('HousingLettersService', () => {
  let service: HousingLettersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousingLettersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
