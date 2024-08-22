import { TestBed } from '@angular/core/testing';

import { ListsservicesService } from './listsservices.service';

describe('ListsservicesService', () => {
  let service: ListsservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListsservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
