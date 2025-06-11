import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle file operations', () => {
    const mockEvent = { target: { files: [new File(['test'], 'test.json')] } };
    service.open(mockEvent);
    expect(service.fileName).toBe('test.json');
  });

  it('should handle renew operation', async () => {
    await service.renew();
    expect(service.fileName).toBe('');
  });

  it('should handle dimension setting', () => {
    service.setDimension(3);
    expect(service).toBeDefined();
  });

  it('should handle filename shortening', () => {
    const longFilename = 'very-long-filename-that-exceeds-limit.json';
    const result = service.shortenFilename(longFilename, 20);
    expect(result.length).toBeLessThanOrEqual(23); // includes '...'
  });
});
