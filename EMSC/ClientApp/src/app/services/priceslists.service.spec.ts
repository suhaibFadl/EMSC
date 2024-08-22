import { TestBed } from '@angular/core/testing';

import { PriceslistsService } from './priceslists.service';

describe('PriceslistsService', () => {
  let service: PriceslistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceslistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
