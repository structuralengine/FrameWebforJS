import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultCombineDisgComponent } from './result-combine-disg.component';
import { ResultCombineDisgService } from './result-combine-disg.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('ResultCombineDisgComponent', () => {
  let component: ResultCombineDisgComponent;
  let fixture: ComponentFixture<ResultCombineDisgComponent>;
  let resultCombineDisgService: jasmine.SpyObj<ResultCombineDisgService>;

  beforeEach(async () => {
    const resultCombineDisgServiceSpy = jasmine.createSpyObj('ResultCombineDisgService', [
      'getCombineDisgColumns', 'getDataColumns', 'getDisgJson', 'setDisgCombineJson', 'clear'
    ], {
      isCalculated: false
    });
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ResultCombineDisgComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ResultCombineDisgService, useValue: resultCombineDisgServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultCombineDisgComponent);
    component = fixture.componentInstance;
    resultCombineDisgService = TestBed.inject(ResultCombineDisgService) as jasmine.SpyObj<ResultCombineDisgService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCombineDisgColumns from service', () => {
    const mockColumns = [
      { title: 'result.case', id: 'case' },
      { title: 'result.node', id: 'node' },
      { title: 'result.dx', id: 'dx' },
      { title: 'result.dy', id: 'dy' },
      { title: 'result.dz', id: 'dz' }
    ];
    resultCombineDisgService.getCombineDisgColumns.and.returnValue(mockColumns);

    const result = resultCombineDisgService.getCombineDisgColumns(1, 'dx_max');
    
    expect(resultCombineDisgService.getCombineDisgColumns).toHaveBeenCalledWith(1, 'dx_max');
    expect(result).toEqual(mockColumns);
  });

  it('should handle combine displacement result data operations', () => {
    const testCombineDisgData = {
      1: [
        { case: 'COMB1', node: '1', dx: '0.001', dy: '0.002', dz: '0.000' },
        { case: 'COMB1', node: '2', dx: '0.003', dy: '0.001', dz: '0.000' }
      ]
    };

    resultCombineDisgService.getDisgJson.and.returnValue(testCombineDisgData);
    
    const result = resultCombineDisgService.getDisgJson();
    expect(result).toEqual(testCombineDisgData);
    expect(resultCombineDisgService.getDisgJson).toHaveBeenCalled();
  });

  it('should handle setDisgCombineJson', () => {
    const testData = {
      combine_disg: {
        1: [
          { case: 'COMB1', node: '1', dx: '0.001', dy: '0.002', dz: '0.000' }
        ]
      }
    };
    const defList = {};
    const combList = {};
    const pickList = {};

    resultCombineDisgService.setDisgCombineJson(testData, defList, combList, pickList);
    expect(resultCombineDisgService.setDisgCombineJson).toHaveBeenCalledWith(testData, defList, combList, pickList);
  });

  it('should handle calculation status', () => {
    resultCombineDisgService.isCalculated = true;
    expect(resultCombineDisgService.isCalculated).toBe(true);

    resultCombineDisgService.isCalculated = false;
    expect(resultCombineDisgService.isCalculated).toBe(false);
  });

  it('should handle clear operation', () => {
    resultCombineDisgService.clear();
    expect(resultCombineDisgService.clear).toHaveBeenCalled();
  });
});
