import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ElectronService } from './electron.service';

describe('ElectronService', () => {
  let service: ElectronService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ElectronService]
    });
    service = TestBed.inject(ElectronService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect electron environment', () => {
    expect(typeof service.isElectron).toBe('boolean');
  });

  it('should handle electron operations', () => {
    if (service.ipcRenderer) {
      expect(service.ipcRenderer).toBeDefined();
    }
  });
});
