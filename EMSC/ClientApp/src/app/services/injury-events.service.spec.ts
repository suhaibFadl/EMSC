import { TestBed } from '@angular/core/testing';

import { InjuryEventsService } from './injury-events.service';

describe('InjuryEventsService', () => {
  let service: InjuryEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjuryEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
