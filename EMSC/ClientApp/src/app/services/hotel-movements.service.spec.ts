import { TestBed } from '@angular/core/testing';

import { HotelMovementsService } from './hotel-movements.service';

describe('HotelMovementsService', () => {
  let service: HotelMovementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelMovementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
