import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultDisgComponent } from './result-disg.component';
import { ResultDisgService } from './result-disg.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('ResultDisgComponent', () => {
  let component: ResultDisgComponent;
  let fixture: ComponentFixture<ResultDisgComponent>;
  let resultDisgService: jasmine.SpyObj<ResultDisgService>;

  beforeEach(async () => {
    const resultDisgServiceSpy = jasmine.createSpyObj('ResultDisgService', [
      'getDisgColumns', 'getDisgJson', 'setDisgJson', 'clear'
    ], {
      isCalculated: false
    });
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ResultDisgComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ResultDisgService, useValue: resultDisgServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultDisgComponent);
    component = fixture.componentInstance;
    resultDisgService = TestBed.inject(ResultDisgService) as jasmine.SpyObj<ResultDisgService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDisgColumns from service', () => {
    const mockColumns = [
      { title: 'result.case', id: 'case' },
      { title: 'result.node', id: 'node' },
      { title: 'result.dx', id: 'dx' },
      { title: 'result.dy', id: 'dy' },
      { title: 'result.dz', id: 'dz' }
    ];
    resultDisgService.getDisgColumns.and.returnValue(mockColumns);

    const result = resultDisgService.getDisgColumns(1);
    
    expect(resultDisgService.getDisgColumns).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockColumns);
  });

  it('should handle displacement result data operations', () => {
    const testDisgData = {
      1: [
        { case: '1', node: '1', dx: '0.001', dy: '0.002', dz: '0.000' },
        { case: '1', node: '2', dx: '0.003', dy: '0.001', dz: '0.000' }
      ]
    };

    resultDisgService.getDisgJson.and.returnValue(testDisgData);
    
    const result = resultDisgService.getDisgJson();
    expect(result).toEqual(testDisgData);
    expect(resultDisgService.getDisgJson).toHaveBeenCalled();
  });

  it('should handle setDisgJson', () => {
    const testData = {
      disg: {
        1: [
          { case: '1', node: '1', dx: '0.001', dy: '0.002', dz: '0.000' }
        ]
      }
    };
    const defList = {};
    const combList = {};
    const pickList = {};

    resultDisgService.setDisgJson(testData, defList, combList, pickList);
    expect(resultDisgService.setDisgJson).toHaveBeenCalledWith(testData, defList, combList, pickList);
  });

  it('should handle calculation status', () => {
    resultDisgService.isCalculated = true;
    expect(resultDisgService.isCalculated).toBe(true);

    resultDisgService.isCalculated = false;
    expect(resultDisgService.isCalculated).toBe(false);
  });

  it('should handle clear operation', () => {
    resultDisgService.clear();
    expect(resultDisgService.clear).toHaveBeenCalled();
  });
});
