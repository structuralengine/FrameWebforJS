import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputDataService } from './input-data.service';
import { DataHelperModule } from './data-helper.module';
import { SceneService } from '../components/three/scene.service';

describe('InputDataService', () => {
  let service: InputDataService;
  let helperSpy: jasmine.SpyObj<DataHelperModule>;
  let sceneSpy: jasmine.SpyObj<SceneService>;

  beforeEach(() => {
    const helperSpyObj = jasmine.createSpyObj('DataHelperModule', ['toNumber'], {
      dimension: 3,
      dimensionInit: 3
    });
    const sceneSpyObj = jasmine.createSpyObj('SceneService', ['setSetting', 'getSettingJson']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        InputDataService,
        { provide: DataHelperModule, useValue: helperSpyObj },
        { provide: SceneService, useValue: sceneSpyObj }
      ]
    });
    service = TestBed.inject(InputDataService);
    helperSpy = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
    sceneSpy = TestBed.inject(SceneService) as jasmine.SpyObj<SceneService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.node).toBeDefined();
    expect(service.member).toBeDefined();
    expect(service.fixnode).toBeDefined();
    expect(service.fixmenber).toBeDefined();
    expect(service.joint).toBeDefined();
    expect(service.load).toBeDefined();
    expect(service.define).toBeDefined();
    expect(service.combine).toBeDefined();
    expect(service.pickup).toBeDefined();
    expect(service.notice).toBeDefined();
    expect(service.panel).toBeDefined();
    expect(service.element).toBeDefined();
    expect(service.result).toBeNull();
  });

  it('should clear all data', () => {
    service.result = { test: 'data' };
    
    service.clear();
    
    expect(service.node.clear).toHaveBeenCalled();
    expect(service.fixnode.clear).toHaveBeenCalled();
    expect(service.member.clear).toHaveBeenCalled();
    expect(service.element.clear).toHaveBeenCalled();
    expect(service.joint.clear).toHaveBeenCalled();
    expect(service.panel.clear).toHaveBeenCalled();
    expect(service.notice.clear).toHaveBeenCalled();
    expect(service.fixmenber.clear).toHaveBeenCalled();
    expect(service.load.clear).toHaveBeenCalled();
    expect(service.define.clear).toHaveBeenCalled();
    expect(service.combine.clear).toHaveBeenCalled();
    expect(service.pickup.clear).toHaveBeenCalled();
    expect(service.result).toBeNull();
  });

  it('should handle getResult', () => {
    const testData = {
      old_points: 100,
      deduct_points: 10,
      new_points: 90,
      disg: [{ case: 1, node: 1, dx: 0.1 }]
    };
    
    service.getResult(testData);
    
    expect(service.result).toEqual({
      disg: [{ case: 1, node: 1, dx: 0.1 }]
    });
    expect(service.result['old_points']).toBeUndefined();
    expect(service.result['deduct_points']).toBeUndefined();
    expect(service.result['new_points']).toBeUndefined();
  });

  it('should handle getInputJson with default parameters', () => {
    const result = service.getInputJson();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result['ver']).toBeDefined();
  });

  it('should handle getInputJson for calculation (empty = 0)', () => {
    const result = service.getInputJson(0);
    expect(result).toBeDefined();
    expect(result['node']).toEqual({});
    expect(result['member']).toEqual({});
    expect(result['element']).toEqual({});
    expect(result['load']).toEqual({});
    expect(result['rigid']).toEqual([]);
  });

  it('should handle getInputJson for printing (empty = 1)', () => {
    const result = service.getInputJson(1);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should handle loadInputData', () => {
    const testData = {
      node: { 1: { x: 0, y: 0, z: 0 } },
      member: { 1: { ni: 1, nj: 2 } },
      dimension: 2
    };
    
    service.loadInputData(testData);
    
    expect(service.node.setNodeJson).toHaveBeenCalledWith(testData);
    expect(service.member.setMemberJson).toHaveBeenCalledWith(testData);
    expect(helperSpy.dimension).toBe(2);
    expect(helperSpy.dimensionInit).toBe(2);
  });

  it('should handle getCalcText', () => {
    const properties = { uid: 'test-user', production: true };
    const result = service.getCalcText(properties);
    
    expect(typeof result).toBe('string');
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('should handle create2Ddata', () => {
    const testData = {
      node: { 1: { x: 0, y: 0 } },
      member: { 1: { ni: 1, nj: 2 } },
      element: { steel: { 1: { E: 200000 } } }
    };
    
    service.create2Ddata(testData);
    
    expect(testData.node[1]['z']).toBe(0);
    expect(testData.member[1]['cg']).toBe(0);
    expect(testData.element.steel[1]['G']).toBe(1);
    expect(testData.element.steel[1]['J']).toBe(1);
    expect(testData.element.steel[1]['Iy']).toBe(1);
  });

  it('should handle version checking for older versions', () => {
    helperSpy.toNumber.and.returnValue(10);
    const testData = {
      ver: '1.0.0',
      node: { 1: { x: 0, y: 10, z: 5 } }
    };
    
    service.loadInputData(testData);
    
    expect(sceneSpy.setSetting).not.toHaveBeenCalled();
  });

  it('should handle version checking for newer versions', () => {
    const testData = {
      ver: '2.1.0',
      node: { 1: { x: 0, y: 10, z: 5 } }
    };
    
    service.loadInputData(testData);
    
    expect(sceneSpy.setSetting).toHaveBeenCalledWith(testData);
  });
});
