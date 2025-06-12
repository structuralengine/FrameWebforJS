import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultDataService } from './result-data.service';
import { DataHelperModule } from './data-helper.module';
import { InputDataService } from './input-data.service';

describe('ResultDataService', () => {
  let service: ResultDataService;
  let helperSpy: jasmine.SpyObj<DataHelperModule>;
  let inputDataSpy: jasmine.SpyObj<InputDataService>;

  beforeEach(() => {
    const helperSpyObj = jasmine.createSpyObj('DataHelperModule', ['toNumber']);
    const inputDataSpyObj = jasmine.createSpyObj('InputDataService', ['define', 'combine', 'pickup']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        ResultDataService,
        { provide: DataHelperModule, useValue: helperSpyObj },
        { provide: InputDataService, useValue: inputDataSpyObj }
      ]
    });
    service = TestBed.inject(ResultDataService);
    helperSpy = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
    inputDataSpy = TestBed.inject(InputDataService) as jasmine.SpyObj<InputDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.isCalculated).toBe(false);
    expect(service.page).toBe(1);
    expect(service.case).toBe('basic');
    expect(service.disg).toBeDefined();
    expect(service.reac).toBeDefined();
    expect(service.fsec).toBeDefined();
    expect(service.combdisg).toBeDefined();
    expect(service.combreac).toBeDefined();
    expect(service.combfsec).toBeDefined();
    expect(service.pickdisg).toBeDefined();
    expect(service.pickreac).toBeDefined();
    expect(service.pickfsec).toBeDefined();
  });

  it('should clear all data', () => {
    service.isCalculated = true;
    service.page = 5;
    service.case = 'comb';
    
    service.clear();
    
    expect(service.isCalculated).toBe(false);
    expect(service.page).toBe(1);
    expect(service.case).toBe('basic');
    expect(service.disg.clear).toHaveBeenCalled();
    expect(service.reac.clear).toHaveBeenCalled();
    expect(service.fsec.clear).toHaveBeenCalled();
    expect(service.combdisg.clear).toHaveBeenCalled();
    expect(service.combreac.clear).toHaveBeenCalled();
    expect(service.combfsec.clear).toHaveBeenCalled();
    expect(service.pickdisg.clear).toHaveBeenCalled();
    expect(service.pickreac.clear).toHaveBeenCalled();
    expect(service.pickfsec.clear).toHaveBeenCalled();
  });

  it('should handle loadResultData', () => {
    const testData = {
      disg: [{ case: 1, node: 1, dx: 0.1 }],
      reac: [{ case: 1, node: 1, fx: 100 }],
      fsec: [{ case: 1, member: 1, fx: 50 }]
    };
    
    service.loadResultData(testData);
    
    expect(service.disg.setDisgJson).toHaveBeenCalled();
    expect(service.reac.setReacJson).toHaveBeenCalled();
    expect(service.fsec.setFsecJson).toHaveBeenCalled();
  });

  it('should handle getPickUpJson', () => {
    const result = service.getPickUpJson();
    expect(result).toBeDefined();
  });

  it('should handle getDefineJson', () => {
    const result = service.getDefineJson();
    expect(result).toBeDefined();
  });

  it('should handle getCombineJson', () => {
    const result = service.getCombineJson();
    expect(result).toBeDefined();
  });

  it('should handle GetPicUpText', () => {
    service.pickfsec.fsecPickup = {
      '1': {
        fx_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        fx_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } },
        fy_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        fy_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } },
        fz_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        fz_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } },
        mx_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        mx_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } },
        my_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        my_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } },
        mz_max: { 0: { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, fz: 0, mx: 10, my: 5, mz: 0 } },
        mz_min: { 0: { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, fz: 0, mx: -10, my: -5, mz: 0 } }
      }
    };
    helperSpy.toNumber.and.returnValue(1);
    
    const result = service.GetPicUpText();
    
    expect(typeof result).toBe('string');
    expect(result).toContain('PickUpNo,着目断面力,部材No');
    expect(result).toContain('1,fx,1,C1,C2');
  });

  it('should handle GetPicUpText2D', () => {
    service.pickfsec.fsecPickup = {
      '1': {
        fx_max: { '0': { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, mz: 10 } },
        fx_min: { '0': { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, mz: -10 } },
        fy_max: { '0': { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, mz: 10 } },
        fy_min: { '0': { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, mz: -10 } },
        mz_max: { '0': { m: '1', comb: 'C1', l: 0.5, fx: 100, fy: 50, mz: 10 } },
        mz_min: { '0': { m: '1', comb: 'C2', l: 0.5, fx: -100, fy: -50, mz: -10 } }
      }
    };
    helperSpy.toNumber.and.returnValue(1);
    
    const result = service.GetPicUpText2D();
    
    expect(typeof result).toBe('string');
    expect(result).toContain('PickUpNo,着目力,部材No');
  });

  it('should handle initColumnTable', () => {
    const dataColumn = [
      { title: 'test.column1', id: 'col1', format: 'string' },
      { title: 'test.column2', id: 'col2', format: 'number', width: 50 }
    ];
    
    const result = service.initColumnTable(dataColumn, 100, true);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].dataIndx).toBe('col1');
    expect(result[0].width).toBe(100);
    expect(result[0].editable).toBe(true);
    expect(result[1].width).toBe(150);
  });
});
