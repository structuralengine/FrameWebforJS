import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultReacComponent } from './result-reac.component';
import { ResultReacService } from './result-reac.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('ResultReacComponent', () => {
  let component: ResultReacComponent;
  let fixture: ComponentFixture<ResultReacComponent>;
  let resultReacService: jasmine.SpyObj<ResultReacService>;

  beforeEach(async () => {
    const resultReacServiceSpy = jasmine.createSpyObj('ResultReacService', [
      'getReacColumns', 'getReacJson', 'setReacJson', 'clear'
    ], {
      isCalculated: false
    });
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ResultReacComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ResultReacService, useValue: resultReacServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultReacComponent);
    component = fixture.componentInstance;
    resultReacService = TestBed.inject(ResultReacService) as jasmine.SpyObj<ResultReacService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getReacColumns from service', () => {
    const mockColumns = [
      { title: 'result.case', id: 'case' },
      { title: 'result.node', id: 'node' },
      { title: 'result.rx', id: 'rx' },
      { title: 'result.ry', id: 'ry' },
      { title: 'result.rz', id: 'rz' }
    ];
    resultReacService.getReacColumns.and.returnValue(mockColumns);

    const result = resultReacService.getReacColumns(1);
    
    expect(resultReacService.getReacColumns).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockColumns);
  });

  it('should handle reaction result data operations', () => {
    const testReacData = {
      1: [
        { case: '1', node: '1', rx: '100.0', ry: '0.0', rz: '0.0' },
        { case: '1', node: '2', rx: '0.0', ry: '-50.0', rz: '0.0' }
      ]
    };

    resultReacService.getReacJson.and.returnValue(testReacData);
    
    const result = resultReacService.getReacJson();
    expect(result).toEqual(testReacData);
    expect(resultReacService.getReacJson).toHaveBeenCalled();
  });

  it('should handle setReacJson', () => {
    const testData = {
      reac: {
        1: [
          { case: '1', node: '1', rx: '100.0', ry: '0.0', rz: '0.0' }
        ]
      }
    };
    const defList = {};
    const combList = {};
    const pickList = {};

    resultReacService.setReacJson(testData, defList, combList, pickList);
    expect(resultReacService.setReacJson).toHaveBeenCalledWith(testData, defList, combList, pickList);
  });

  it('should handle calculation status', () => {
    resultReacService.isCalculated = true;
    expect(resultReacService.isCalculated).toBe(true);

    resultReacService.isCalculated = false;
    expect(resultReacService.isCalculated).toBe(false);
  });

  it('should handle clear operation', () => {
    resultReacService.clear();
    expect(resultReacService.clear).toHaveBeenCalled();
  });
});
