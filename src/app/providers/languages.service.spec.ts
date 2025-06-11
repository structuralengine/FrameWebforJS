import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LanguagesService } from './languages.service';

describe('LanguagesService', () => {
  let service: LanguagesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LanguagesService]
    });
    service = TestBed.inject(LanguagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle language switching', () => {
    const testLanguage = 'en';
    service.trans(testLanguage);
    expect(service.browserLang).toBe(testLanguage);
  });

  it('should have language index', () => {
    expect(service.languageIndex).toBeDefined();
    expect(service.languageIndex['ja']).toBe('日本語');
    expect(service.languageIndex['en']).toBe('English');
    expect(service.languageIndex['cn']).toBe('中文');
  });

  it('should update language in storage', () => {
    spyOn(localStorage, 'setItem');
    service.updateLanguage();
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', service.browserLang);
  });

  it('should initialize with browser language', () => {
    expect(service.browserLang).toBeDefined();
    expect(typeof service.browserLang).toBe('string');
  });
});
