import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputCombineComponent } from './input-combine.component';
import { InputCombineService } from './input-combine.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputCombineComponent', () => {
  let component: InputCombineComponent;
  let fixture: ComponentFixture<InputCombineComponent>;
  let inputCombineService: jasmine.SpyObj<InputCombineService>;

  beforeEach(async () => {
    const inputCombineServiceSpy = jasmine.createSpyObj('InputCombineService', [
      'getCombineDataColumns', 'getCombineJson', 'setCombineJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputCombineComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputCombineService, useValue: inputCombineServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCombineComponent);
    component = fixture.componentInstance;
    inputCombineService = TestBed.inject(InputCombineService) as jasmine.SpyObj<InputCombineService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCombineDataColumns from service', () => {
    const mockCombine = {
      row: 1,
      name: 'Combination 1',
      C1: '1.0',
      C2: '0.5'
    };
    inputCombineService.getCombineDataColumns.and.returnValue(mockCombine);

    const result = inputCombineService.getCombineDataColumns(1, 2);
    
    expect(inputCombineService.getCombineDataColumns).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual(mockCombine);
  });

  it('should handle combine data operations', () => {
    const testCombineData = {
      1: [
        { row: 1, name: 'Combination 1', case1: '1', coef1: '1.0' }
      ]
    };

    inputCombineService.getCombineJson.and.returnValue(testCombineData);
    
    const result = inputCombineService.getCombineJson();
    expect(result).toEqual(testCombineData);
    expect(inputCombineService.getCombineJson).toHaveBeenCalled();
  });

  it('should handle setCombineJson', () => {
    const testData = {
      combine: {
        1: [
          { row: 1, name: 'Combination 1', case1: '1', coef1: '1.0' }
        ]
      }
    };

    inputCombineService.setCombineJson(testData);
    expect(inputCombineService.setCombineJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputCombineService.clear();
    expect(inputCombineService.clear).toHaveBeenCalled();
  });
});
