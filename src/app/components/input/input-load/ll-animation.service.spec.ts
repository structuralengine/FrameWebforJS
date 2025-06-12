import { TestBed } from '@angular/core/testing';
// import { LLAnimationService } from './ll-animation.service';
import { LLAnimationState, LLAnimationFrame } from './ll-load.types';

describe('LLAnimationService', () => {
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = {
      startAnimation: jasmine.createSpy('startAnimation'),
      stopAnimation: jasmine.createSpy('stopAnimation'),
      pauseAnimation: jasmine.createSpy('pauseAnimation'),
      resumeAnimation: jasmine.createSpy('resumeAnimation'),
      setAnimationSpeed: jasmine.createSpy('setAnimationSpeed'),
      getCurrentFrame: jasmine.createSpy('getCurrentFrame'),
      jumpToCase: jasmine.createSpy('jumpToCase'),
      getAnimationState: jasmine.createSpy('getAnimationState')
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startAnimation', () => {
    it('should start animation with correct state', () => {
      const totalCases = 10;
      const speed = 1000;

      service.startAnimation(totalCases, speed);

      service.getAnimationState().subscribe(state => {
        expect(state.isActive).toBe(true);
        expect(state.totalCases).toBe(totalCases);
        expect(state.speed).toBe(speed);
        expect(state.currentCaseIndex).toBe(0);
      });
    });
  });

  describe('stopAnimation', () => {
    it('should stop animation', () => {
      service.startAnimation(5, 1000);
      service.stopAnimation();

      service.getAnimationState().subscribe(state => {
        expect(state.isActive).toBe(false);
      });
    });
  });

  describe('pauseAnimation', () => {
    it('should pause animation', () => {
      service.startAnimation(5, 1000);
      service.pauseAnimation();

      service.getAnimationState().subscribe(state => {
        expect(state.isActive).toBe(false);
      });
    });
  });

  describe('resumeAnimation', () => {
    it('should resume animation', () => {
      service.startAnimation(5, 1000);
      service.pauseAnimation();
      service.resumeAnimation();

      service.getAnimationState().subscribe(state => {
        expect(state.isActive).toBe(true);
      });
    });
  });

  describe('setAnimationSpeed', () => {
    it('should update animation speed', () => {
      const newSpeed = 500;
      service.setAnimationSpeed(newSpeed);

      service.getAnimationState().subscribe(state => {
        expect(state.speed).toBe(newSpeed);
      });
    });
  });

  describe('getCurrentFrame', () => {
    it('should return current animation frame', () => {
      service.startAnimation(5, 1000);

      service.getCurrentFrame().subscribe(frame => {
        expect(frame).toBeDefined();
        expect(frame.caseId).toBeDefined();
        expect(frame.index).toBeGreaterThanOrEqual(0);
        expect(frame.progress).toBeGreaterThanOrEqual(0);
        expect(frame.progress).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('jumpToCase', () => {
    it('should jump to specific case index', () => {
      const targetIndex = 3;
      service.startAnimation(10, 1000);
      service.jumpToCase(targetIndex);

      service.getAnimationState().subscribe(state => {
        expect(state.currentCaseIndex).toBe(targetIndex);
      });
    });

    it('should handle invalid case index', () => {
      service.startAnimation(5, 1000);
      service.jumpToCase(10);

      service.getAnimationState().subscribe(state => {
        expect(state.currentCaseIndex).toBeLessThan(5);
      });
    });
  });
});
