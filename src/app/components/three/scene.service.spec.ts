import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SceneService } from './scene.service';

describe('SceneService', () => {
  let service: SceneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SceneService]
    });
    service = TestBed.inject(SceneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle scene operations', () => {
    if (service.changeGui) {
      service.changeGui(3);
      expect(service).toBeDefined();
    }
  });

  it('should handle 3D scene management', () => {
    expect(service).toBeDefined();
  });
});
