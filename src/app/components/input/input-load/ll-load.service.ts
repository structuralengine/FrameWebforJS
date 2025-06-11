import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../../providers/data-helper.module';
import { InputMembersService } from '../input-members/input-members.service';
import { LLLoad, LLPositionResult, LLCacheKey } from './ll-load.types';

@Injectable({
  providedIn: 'root'
})
export class LLLoadService {
  private positionCache = new Map<string, LLPositionResult>();

  constructor(
    private helper: DataHelperModule,
    private member: InputMembersService
  ) {}

  public calculateLLPosition(loads: LLLoad[]): LLPositionResult {
    const cacheKey = this.generateCacheKey(loads);
    
    if (this.positionCache.has(cacheKey)) {
      return this.positionCache.get(cacheKey)!;
    }

    let L1: number = 0;

    for (let i = 0; i < loads.length; i++) {
      const targetLoad = loads[i];
      const _L1: number = this.helper.toNumber(targetLoad.L1);
      if (_L1 <= 0) {
        L1 -= _L1;
      }
      if (this.helper.toNumber(targetLoad.L2) <= 0) {
        L1 -= this.helper.toNumber(targetLoad.L2);
      }
    }

    let L2 = 0;
    const m1: number = Math.abs(this.helper.toNumber(loads[0].m1));
    let m2: number = Math.abs(this.helper.toNumber(loads[0].m2));
    if (m2 === 0) {
      m2 = m1;
    }
    
    for (let j = m1; j <= m2; j++) {
      L2 += Math.round(this.member.getMemberLength(j.toString()) * 1000);
    }
    L2 = L2 / 1000;

    const result: LLPositionResult = {
      startPosition: -L1,
      totalLength: L2
    };

    this.positionCache.set(cacheKey, result);
    return result;
  }

  public isLLLoad(symbol: string): boolean {
    return symbol?.includes('LL') || false;
  }

  public validatePitch(pitch: number): number {
    return Math.max(0.1, pitch || 0.1);
  }

  public generateLLLoadCases(baseCase: string, loads: LLLoad[]): string[] {
    const cases: string[] = [];
    const positionResult = this.calculateLLPosition(loads);
    const steps = Math.ceil(positionResult.totalLength / 0.1);
    
    for (let i = 0; i <= steps; i++) {
      cases.push(`${baseCase}.${i}`);
    }
    
    return cases;
  }

  public clearPositionCache(): void {
    this.positionCache.clear();
  }

  private generateCacheKey(loads: LLLoad[]): string {
    return JSON.stringify(loads.map(load => ({
      m1: load.m1,
      m2: load.m2,
      L1: load.L1,
      L2: load.L2
    })));
  }
}
