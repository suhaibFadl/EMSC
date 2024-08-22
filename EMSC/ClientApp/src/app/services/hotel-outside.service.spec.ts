import { TestBed } from '@angular/core/testing';

import { HotelOutsideService } from './hotel-outside.service';

describe('HotelOutsideService', () => {
  let service: HotelOutsideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelOutsideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
