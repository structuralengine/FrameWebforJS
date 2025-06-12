import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PrintService } from './print.service';

describe('PrintService', () => {
  let service: PrintService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrintService]
    });
    service = TestBed.inject(PrintService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle print document', () => {
    const documentName = 'test-document';
    const documentData = ['data1', 'data2'];
    service.printDocument(documentName, documentData);
    expect(service.isPrinting).toBe(true);
  });

  it('should handle radio selection', () => {
    service.selectRadio(1);
    expect(service.flg).toBe(1);
  });

  it('should handle checkbox selection', () => {
    service.selectCheckbox(0);
    expect(service.arrFlg).toContain(0);
  });

  it('should handle clear operation', () => {
    service.clear();
    expect(service.optionList).toBeDefined();
    expect(service.optionList['input']).toBeDefined();
  });
});
