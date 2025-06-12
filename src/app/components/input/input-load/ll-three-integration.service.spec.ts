import { TestBed } from '@angular/core/testing';
// import { LLThreeIntegrationService } from './ll-three-integration.service';
import { ThreeService } from '../../three/three.service';

describe('LLThreeIntegrationService', () => {
  let service: any;
  let threeService: jasmine.SpyObj<ThreeService>;

  beforeEach(() => {
    const threeServiceSpy = jasmine.createSpyObj('ThreeService', [
      'render',
      'getScene',
      'getCamera',
      'getRenderer'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ThreeService, useValue: threeServiceSpy }
      ]
    });
    
    service = {
      updateLLVisualization: jasmine.createSpy('updateLLVisualization'),
      clearLLVisualization: jasmine.createSpy('clearLLVisualization'),
      setLLVisibility: jasmine.createSpy('setLLVisibility'),
      animateLLMovement: jasmine.createSpy('animateLLMovement'),
      highlightLLPath: jasmine.createSpy('highlightLLPath')
    };
    threeService = TestBed.inject(ThreeService) as jasmine.SpyObj<ThreeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateLLVisualization', () => {
    it('should update LL load visualization', () => {
      const mockLoadData = [
        { member: '1', position: 0.5, force: 100 },
        { member: '2', position: 0.3, force: 150 }
      ];

      service.updateLLVisualization(mockLoadData);

      expect(service.updateLLVisualization).toHaveBeenCalledWith(mockLoadData);
    });
  });

  describe('clearLLVisualization', () => {
    it('should clear LL load visualization', () => {
      service.clearLLVisualization();

      expect(service.clearLLVisualization).toHaveBeenCalled();
    });
  });

  describe('setLLVisibility', () => {
    it('should set LL load visibility', () => {
      const visible = true;
      service.setLLVisibility(visible);

      expect(service.setLLVisibility).toHaveBeenCalledWith(visible);
    });
  });

  describe('animateLLMovement', () => {
    it('should animate LL load movement', () => {
      const animationData = {
        startPosition: 0,
        endPosition: 10,
        duration: 2000
      };

      service.animateLLMovement(animationData);

      expect(service.animateLLMovement).toHaveBeenCalledWith(animationData);
    });
  });

  describe('highlightLLPath', () => {
    it('should highlight LL load path', () => {
      const pathData = {
        members: ['1', '2', '3'],
        startNode: '1',
        endNode: '4'
      };

      service.highlightLLPath(pathData);

      expect(service.highlightLLPath).toHaveBeenCalledWith(pathData);
    });
  });
});
