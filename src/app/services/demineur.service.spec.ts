import { TestBed } from '@angular/core/testing';

import { DemineurService } from './demineur.service';

describe('DemineurService', () => {
  let service: DemineurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemineurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
