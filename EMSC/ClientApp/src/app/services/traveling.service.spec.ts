import { TestBed } from '@angular/core/testing';

import { TravelingService } from './traveling.service';

describe('TravelingService', () => {
  let service: TravelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
