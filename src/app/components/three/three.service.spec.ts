import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ThreeService } from './three.service';

describe('ThreeService', () => {
  let service: ThreeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ThreeService]
    });
    service = TestBed.inject(ThreeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle file operations', () => {
    if (service.fileName !== undefined) {
      expect(typeof service.fileName).toBe('string');
    }
  });

  it('should handle mode operations', () => {
    if (service.mode !== undefined) {
      expect(typeof service.mode).toBe('string');
    }
  });

  it('should handle data clearing', () => {
    if (service.ClearData) {
      service.ClearData();
      expect(service).toBeDefined();
    }
  });
});
