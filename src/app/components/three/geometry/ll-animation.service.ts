import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { LLAnimationState, LLAnimationFrame } from '../../input/input-load/ll-load.types';

@Injectable({
  providedIn: 'root'
})
export class LLAnimationService {
  private currentState$ = new BehaviorSubject<LLAnimationState>({
    isActive: false,
    currentCaseIndex: 0,
    totalCases: 0,
    speed: 1.0
  });

  private animationSubscription: Subscription | null = null;
  private legacyAnimationHandle: number | undefined;

  public getAnimationState() {
    return this.currentState$.asObservable();
  }

  public startAnimation(cases: string[], callback: (caseId: string, index: number) => void): void {
    this.stopAnimation();

    const state = this.currentState$.value;
    this.currentState$.next({
      ...state,
      isActive: true,
      totalCases: cases.length,
      currentCaseIndex: 0
    });

    this.animationSubscription = interval(100 / state.speed).subscribe(() => {
      const currentState = this.currentState$.value;
      const frameIndex = Math.floor(currentState.currentCaseIndex / 10);
      
      if (frameIndex < cases.length) {
        callback(cases[frameIndex], frameIndex);
        
        this.currentState$.next({
          ...currentState,
          currentCaseIndex: currentState.currentCaseIndex + 1
        });
      } else {
        this.currentState$.next({
          ...currentState,
          currentCaseIndex: 0
        });
      }
    });
  }

  public startLegacyAnimation(
    cases: string[], 
    callback: (caseId: string, index: number) => void,
    frameIndex: number = 0,
    oldFrameIndex: number = 0
  ): void {
    this.stopAnimation();

    const state = this.currentState$.value;
    this.currentState$.next({
      ...state,
      isActive: true,
      totalCases: cases.length,
      currentCaseIndex: frameIndex
    });

    let currentFrameIndex = Math.floor(frameIndex / 10);

    if (currentFrameIndex < cases.length) {
      frameIndex = frameIndex + 1;
    } else {
      frameIndex = 0;
      currentFrameIndex = 0;
    }

    this.legacyAnimationHandle = requestAnimationFrame(() => {
      this.startLegacyAnimation(cases, callback, frameIndex, currentFrameIndex);
    });

    if (currentFrameIndex === oldFrameIndex) {
      return;
    }

    callback(cases[currentFrameIndex], currentFrameIndex);
  }

  public pauseAnimation(): void {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
      this.animationSubscription = null;
    }
    
    if (this.legacyAnimationHandle !== undefined) {
      cancelAnimationFrame(this.legacyAnimationHandle);
      this.legacyAnimationHandle = undefined;
    }

    const state = this.currentState$.value;
    this.currentState$.next({
      ...state,
      isActive: false
    });
  }

  public resumeAnimation(): void {
  }

  public stopAnimation(): void {
    this.pauseAnimation();
    
    this.currentState$.next({
      isActive: false,
      currentCaseIndex: 0,
      totalCases: 0,
      speed: 1.0
    });
  }

  public setAnimationSpeed(speed: number): void {
    const state = this.currentState$.value;
    this.currentState$.next({
      ...state,
      speed: Math.max(0.1, Math.min(5.0, speed))
    });
  }
}
