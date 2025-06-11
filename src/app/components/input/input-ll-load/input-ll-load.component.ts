import { Component, OnInit, OnDestroy } from '@angular/core';
import { LLLoadService } from '../input-load/ll-load.service';
import { LLAnimationService } from '../../three/geometry/ll-animation.service';
import { LLThreeIntegrationService } from '../../three/geometry/ll-three-integration.service';
import { LLAnimationState } from '../input-load/ll-load.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-ll-load',
  template: `
    <div class="ll-load-controls">
      <div class="pitch-control">
        <label for="ll-pitch">LL Pitch:</label>
        <input 
          id="ll-pitch" 
          type="number" 
          [(ngModel)]="pitch" 
          (change)="onPitchChange()" 
          min="0.1" 
          step="0.1"
        />
      </div>
      
      <div class="animation-controls">
        <button (click)="startAnimation()" [disabled]="animationState.isActive">
          Start Animation
        </button>
        <button (click)="pauseAnimation()" [disabled]="!animationState.isActive">
          Pause
        </button>
        <button (click)="stopAnimation()">
          Stop
        </button>
      </div>
      
      <div class="animation-info" *ngIf="animationState.totalCases > 0">
        <span>Case {{ animationState.currentCaseIndex + 1 }} of {{ animationState.totalCases }}</span>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            [style.width.%]="(animationState.currentCaseIndex / animationState.totalCases) * 100"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ll-load-controls {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 10px 0;
    }
    
    .pitch-control {
      margin-bottom: 10px;
    }
    
    .pitch-control label {
      display: inline-block;
      width: 80px;
      margin-right: 10px;
    }
    
    .pitch-control input {
      width: 100px;
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 2px;
    }
    
    .animation-controls {
      margin-bottom: 10px;
    }
    
    .animation-controls button {
      margin-right: 10px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
    }
    
    .animation-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .animation-controls button:hover:not(:disabled) {
      background: #e5e5e5;
    }
    
    .progress-bar {
      width: 200px;
      height: 10px;
      background: #f0f0f0;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 5px;
    }
    
    .progress-fill {
      height: 100%;
      background: #007bff;
      transition: width 0.3s ease;
    }
  `]
})
export class InputLLLoadComponent implements OnInit, OnDestroy {
  pitch: number = 0.1;
  currentCaseId: string = '';
  animationState: LLAnimationState = {
    isActive: false,
    currentCaseIndex: 0,
    totalCases: 0,
    speed: 1.0
  };

  private animationSubscription: Subscription | null = null;

  constructor(
    private llLoadService: LLLoadService,
    private animationService: LLAnimationService,
    private llThreeIntegration: LLThreeIntegrationService
  ) {}

  ngOnInit(): void {
    this.animationSubscription = this.animationService.getAnimationState()
      .subscribe(state => {
        this.animationState = state;
      });
  }

  ngOnDestroy(): void {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }

  onPitchChange(): void {
    this.pitch = this.llLoadService.validatePitch(this.pitch);
  }

  startAnimation(): void {
    if (this.currentCaseId) {
      this.llThreeIntegration.startLLAnimation(this.currentCaseId, true);
    }
  }

  pauseAnimation(): void {
    this.animationService.pauseAnimation();
  }

  stopAnimation(): void {
    this.animationService.stopAnimation();
  }

  setCaseId(caseId: string): void {
    this.currentCaseId = caseId;
  }
}
