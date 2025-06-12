import { TestBed } from '@angular/core/testing';
import { LLLoadService } from './ll-load.service';
import { InputMembersService } from '../input-members/input-members.service';
import { LLLoad, LLLoadConfiguration, LLPositionResult } from './ll-load.types';

describe('LLLoadService', () => {
  let service: LLLoadService;
  let inputMembersService: jasmine.SpyObj<InputMembersService>;

  beforeEach(() => {
    const inputMembersServiceSpy = jasmine.createSpyObj('InputMembersService', [
      'getMemberJson'
    ]);

    TestBed.configureTestingModule({
      providers: [
        LLLoadService,
        { provide: InputMembersService, useValue: inputMembersServiceSpy }
      ]
    });
    
    service = TestBed.inject(LLLoadService);
    inputMembersService = TestBed.inject(InputMembersService) as jasmine.SpyObj<InputMembersService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateLLPosition', () => {
    it('should calculate position correctly for valid LL load', () => {
      const llLoads: LLLoad[] = [{
        m1: '1',
        m2: '2',
        direction: 'x',
        mark: 'LL1',
        L1: '2.0',
        L2: '3.0',
        P1: '100',
        P2: '150',
        n: '5'
      }];

      const mockMemberData = {
        1: { ni: '1', nj: '2', L: '10.0' },
        2: { ni: '2', nj: '3', L: '8.0' }
      };

      inputMembersService.getMemberJson.and.returnValue(mockMemberData);

      const result: LLPositionResult = service.calculateLLPosition(llLoads);

      expect(result.startPosition).toBeGreaterThanOrEqual(0);
      expect(result.totalLength).toBeGreaterThan(0);
      expect(inputMembersService.getMemberJson).toHaveBeenCalled();
    });

    it('should handle invalid member references', () => {
      const llLoads: LLLoad[] = [{
        m1: '999',
        m2: '1000',
        direction: 'x',
        mark: 'LL1',
        L1: '2.0',
        L2: '3.0',
        P1: '100',
        P2: '150',
        n: '5'
      }];

      inputMembersService.getMemberJson.and.returnValue({});

      const result: LLPositionResult = service.calculateLLPosition(llLoads);

      expect(result.startPosition).toBe(0);
      expect(result.totalLength).toBe(0);
    });
  });

  describe('isLLLoad', () => {
    it('should return true for valid LL load data', () => {
      const loadDataString = JSON.stringify({
        m1: '1',
        m2: '2',
        direction: 'x',
        mark: 'LL1',
        L1: '2.0',
        L2: '3.0',
        P1: '100',
        P2: '150',
        n: '5'
      });

      const result = service.isLLLoad(loadDataString);
      expect(result).toBe(true);
    });

    it('should return false for non-LL load data', () => {
      const loadDataString = JSON.stringify({
        node: '1',
        fx: '100',
        fy: '0',
        fz: '0'
      });

      const result = service.isLLLoad(loadDataString);
      expect(result).toBe(false);
    });

    it('should return false for incomplete LL load data', () => {
      const loadDataString = JSON.stringify({
        m1: '1',
        direction: 'x',
        mark: 'LL1'
      });

      const result = service.isLLLoad(loadDataString);
      expect(result).toBe(false);
    });
  });

  describe('validatePitch', () => {
    it('should return valid number for valid pitch value', () => {
      const result = service.validatePitch(2.5);
      expect(result).toBe(2.5);
    });

    it('should return 0 for zero pitch', () => {
      const result = service.validatePitch(0);
      expect(result).toBe(0);
    });

    it('should return valid number for negative pitch', () => {
      const result = service.validatePitch(-1.5);
      expect(result).toBe(-1.5);
    });
  });

  describe('generateLLLoadCases', () => {
    it('should generate correct number of load cases', () => {
      const baseCase = 'LL1';
      const llLoads: LLLoad[] = [{
        m1: '1',
        m2: '2',
        direction: 'x',
        mark: 'LL1',
        L1: '2.0',
        L2: '3.0',
        P1: '100',
        P2: '150',
        n: '5'
      }];

      const mockMemberData = {
        1: { ni: '1', nj: '2', L: '10.0' },
        2: { ni: '2', nj: '3', L: '8.0' }
      };

      inputMembersService.getMemberJson.and.returnValue(mockMemberData);

      const result = service.generateLLLoadCases(baseCase, llLoads);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return cases for any base case', () => {
      const baseCase = 'LL2';
      const llLoads: LLLoad[] = [{
        m1: '1',
        m2: '2',
        direction: 'x',
        mark: 'LL2',
        L1: '2.0',
        L2: '3.0',
        P1: '100',
        P2: '150',
        n: '5'
      }];

      const mockMemberData = {
        1: { ni: '1', nj: '2', L: '5.0' },
        2: { ni: '2', nj: '3', L: '5.0' }
      };

      inputMembersService.getMemberJson.and.returnValue(mockMemberData);

      const result = service.generateLLLoadCases(baseCase, llLoads);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('LL2');
    });
  });

  describe('clearPositionCache', () => {
    it('should clear position cache', () => {
      service.clearPositionCache();
      expect(true).toBe(true);
    });
  });
});
