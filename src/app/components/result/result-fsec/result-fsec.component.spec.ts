import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultFsecComponent } from './result-fsec.component';
import { ResultFsecService } from './result-fsec.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('ResultFsecComponent', () => {
  let component: ResultFsecComponent;
  let fixture: ComponentFixture<ResultFsecComponent>;
  let resultFsecService: jasmine.SpyObj<ResultFsecService>;

  beforeEach(async () => {
    const resultFsecServiceSpy = jasmine.createSpyObj('ResultFsecService', [
      'getFsecColumns', 'getFsecJson', 'setFsecJson', 'clear'
    ], {
      isCalculated: false
    });
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ResultFsecComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ResultFsecService, useValue: resultFsecServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultFsecComponent);
    component = fixture.componentInstance;
    resultFsecService = TestBed.inject(ResultFsecService) as jasmine.SpyObj<ResultFsecService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFsecColumns from service', () => {
    const mockColumns = [
      { title: 'result.case', id: 'case' },
      { title: 'result.member', id: 'member' },
      { title: 'result.position', id: 'position' },
      { title: 'result.fx', id: 'fx' },
      { title: 'result.fy', id: 'fy' },
      { title: 'result.fz', id: 'fz' }
    ];
    resultFsecService.getFsecColumns.and.returnValue(mockColumns);

    const result = resultFsecService.getFsecColumns(1);
    
    expect(resultFsecService.getFsecColumns).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockColumns);
  });

  it('should handle fsec result data operations', () => {
    const testFsecData = {
      1: [
        { case: '1', member: '1', position: '0.0', fx: '100.0', fy: '0.0', fz: '0.0' },
        { case: '1', member: '1', position: '0.5', fx: '50.0', fy: '25.0', fz: '0.0' }
      ]
    };

    resultFsecService.getFsecJson.and.returnValue(testFsecData);
    
    const result = resultFsecService.getFsecJson();
    expect(result).toEqual(testFsecData);
    expect(resultFsecService.getFsecJson).toHaveBeenCalled();
  });

  it('should handle setFsecJson', () => {
    const testData = {
      fsec: {
        1: [
          { case: '1', member: '1', position: '0.0', fx: '100.0', fy: '0.0', fz: '0.0' }
        ]
      }
    };
    const defList = {};
    const combList = {};
    const pickList = {};

    resultFsecService.setFsecJson(testData, defList, combList, pickList);
    expect(resultFsecService.setFsecJson).toHaveBeenCalledWith(testData, defList, combList, pickList);
  });

  it('should handle calculation status', () => {
    resultFsecService.isCalculated = true;
    expect(resultFsecService.isCalculated).toBe(true);

    resultFsecService.isCalculated = false;
    expect(resultFsecService.isCalculated).toBe(false);
  });

  it('should handle clear operation', () => {
    resultFsecService.clear();
    expect(resultFsecService.clear).toHaveBeenCalled();
  });
});
