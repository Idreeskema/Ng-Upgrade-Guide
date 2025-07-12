import { TestBed } from '@angular/core/testing';

import { UpdgradeService } from './updgrade.service';

describe('UpdgradeService', () => {
  let service: UpdgradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdgradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
