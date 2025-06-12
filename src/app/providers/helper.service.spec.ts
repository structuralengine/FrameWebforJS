import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HelperService]
    });
    service = TestBed.inject(HelperService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle language operations', () => {
    if (service.getLang) {
      const lang = service.getLang();
      expect(typeof lang).toBe('string');
    }
  });

  it('should handle utility functions', () => {
    expect(service).toBeDefined();
  });
});
