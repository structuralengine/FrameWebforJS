import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputLoadComponent } from './input-load.component';
import { InputLoadService } from './input-load.service';
import { LLLoadService } from './ll-load.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputLoadComponent', () => {
  let component: InputLoadComponent;
  let fixture: ComponentFixture<InputLoadComponent>;
  let inputLoadService: jasmine.SpyObj<InputLoadService>;
  let llLoadService: jasmine.SpyObj<LLLoadService>;

  beforeEach(async () => {
    const inputLoadServiceSpy = jasmine.createSpyObj('InputLoadService', [
      'getLoadColumns', 'getLoadJson', 'setLoadJson', 'clear', 'getLoadNameJson'
    ]);
    const llLoadServiceSpy = jasmine.createSpyObj('LLLoadService', [
      'calculateLLPosition', 'isLLLoad', 'validatePitch', 'generateLLLoadCases', 'clearPositionCache'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputLoadComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputLoadService, useValue: inputLoadServiceSpy },
        { provide: LLLoadService, useValue: llLoadServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputLoadComponent);
    component = fixture.componentInstance;
    inputLoadService = TestBed.inject(InputLoadService) as jasmine.SpyObj<InputLoadService>;
    llLoadService = TestBed.inject(LLLoadService) as jasmine.SpyObj<LLLoadService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLoadColumns from service', () => {
    const mockLoadColumn = {
      row: 1,
      m1: '',
      m2: '',
      direction: '',
      mark: '',
      L1: '',
      L2: '',
      P1: '',
      P2: '',
      n: '',
      tx: '',
      ty: '',
      tz: '',
      rx: '',
      ry: '',
      rz: ''
    };
    inputLoadService.getLoadColumns.and.returnValue(mockLoadColumn);

    const result = inputLoadService.getLoadColumns(1, 1);
    
    expect(inputLoadService.getLoadColumns).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(mockLoadColumn);
  });

  it('should handle load data operations', () => {
    const testLoadData = {
      1: [
        { case: '1', node: '1', fx: '100', fy: '0', fz: '0' },
        { case: '1', node: '2', fx: '0', fy: '-50', fz: '0' }
      ]
    };

    inputLoadService.getLoadJson.and.returnValue(testLoadData);
    
    const result = inputLoadService.getLoadJson();
    expect(result).toEqual(testLoadData);
    expect(inputLoadService.getLoadJson).toHaveBeenCalled();
  });

  it('should handle setLoadJson', () => {
    const testData = {
      load: {
        1: [
          { case: '1', node: '1', fx: '100', fy: '0', fz: '0' }
        ]
      }
    };

    inputLoadService.setLoadJson(testData);
    expect(inputLoadService.setLoadJson).toHaveBeenCalledWith(testData);
  });

  it('should handle getLoadNameJson', () => {
    const testLoadNames = {
      1: { name: 'Dead Load', symbol: 'DL' },
      2: { name: 'Live Load', symbol: 'LL' }
    };

    inputLoadService.getLoadNameJson.and.returnValue(testLoadNames);
    
    const result = inputLoadService.getLoadNameJson();
    expect(result).toEqual(testLoadNames);
    expect(inputLoadService.getLoadNameJson).toHaveBeenCalled();
  });

  it('should handle LL load operations', () => {
    const testLLLoadString = JSON.stringify({
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

    const testLLLoadArray = [{
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

    llLoadService.isLLLoad.and.returnValue(true);
    llLoadService.calculateLLPosition.and.returnValue({
      startPosition: 0,
      totalLength: 10
    });

    const isLL = llLoadService.isLLLoad(testLLLoadString);
    const position = llLoadService.calculateLLPosition(testLLLoadArray);

    expect(isLL).toBe(true);
    expect(position.startPosition).toBe(0);
    expect(position.totalLength).toBe(10);
    expect(llLoadService.isLLLoad).toHaveBeenCalledWith(testLLLoadString);
    expect(llLoadService.calculateLLPosition).toHaveBeenCalledWith(testLLLoadArray);
  });

  it('should validate LL pitch values', () => {
    llLoadService.validatePitch.and.returnValue(2.5);

    const validatedPitch = llLoadService.validatePitch(2.5);

    expect(validatedPitch).toBe(2.5);
    expect(llLoadService.validatePitch).toHaveBeenCalledWith(2.5);
  });

  it('should handle clear operation', () => {
    inputLoadService.clear();
    expect(inputLoadService.clear).toHaveBeenCalled();
  });
});
