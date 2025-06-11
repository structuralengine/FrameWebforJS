import { Injectable } from '@angular/core';
import { LLLoadService } from '../../input/input-load/ll-load.service';
import { LLAnimationService } from './ll-animation.service';
import { ThreeDisplacementService } from './three-displacement.service';

@Injectable({
  providedIn: 'root'
})
export class LLThreeIntegrationService {
  constructor(
    private llLoadService: LLLoadService,
    private animationService: LLAnimationService,
    private threeDisplacementService: ThreeDisplacementService
  ) {}

  public updateLLLoadDisplay(caseId: string): void {
  }

  public updateLLDisplacementDisplay(
    caseId: string, 
    memberKeys: string[], 
    minDistance: number, 
    maxDistance: number
  ): void {
    this.threeDisplacementService.change_LL_Load(caseId, memberKeys, minDistance, maxDistance);
  }

  public startLLAnimation(caseId: string, useLegacyAnimation: boolean = true): void {
    if (useLegacyAnimation) {
      this.startLegacyLLAnimation(caseId);
    } else {
      this.startModernLLAnimation(caseId);
    }
  }

  private startLegacyLLAnimation(caseId: string): void {
  }

  private startModernLLAnimation(caseId: string): void {
  }

  public stopLLAnimation(): void {
    this.animationService.stopAnimation();
  }
}
