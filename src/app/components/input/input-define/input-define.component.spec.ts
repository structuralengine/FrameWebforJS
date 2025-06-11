import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputDefineComponent } from './input-define.component';
import { InputDefineService } from './input-define.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputDefineComponent', () => {
  let component: InputDefineComponent;
  let fixture: ComponentFixture<InputDefineComponent>;
  let inputDefineService: jasmine.SpyObj<InputDefineService>;

  beforeEach(async () => {
    const inputDefineServiceSpy = jasmine.createSpyObj('InputDefineService', [
      'getDefineDataColumns', 'getDefineJson', 'setDefineJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputDefineComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputDefineService, useValue: inputDefineServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputDefineComponent);
    component = fixture.componentInstance;
    inputDefineService = TestBed.inject(InputDefineService) as jasmine.SpyObj<InputDefineService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDefineDataColumns from service', () => {
    const mockDefine = {
      row: 1,
      C1: '1.0',
      C2: '0.5'
    };
    inputDefineService.getDefineDataColumns.and.returnValue(mockDefine);

    const result = inputDefineService.getDefineDataColumns(1, 2);
    
    expect(inputDefineService.getDefineDataColumns).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual(mockDefine);
  });

  it('should handle define data operations', () => {
    const testDefineData = {
      1: [
        { row: 1, name: 'Definition 1', description: 'Test definition' }
      ]
    };

    inputDefineService.getDefineJson.and.returnValue(testDefineData);
    
    const result = inputDefineService.getDefineJson();
    expect(result).toEqual(testDefineData);
    expect(inputDefineService.getDefineJson).toHaveBeenCalled();
  });

  it('should handle setDefineJson', () => {
    const testData = {
      define: {
        1: [
          { row: 1, name: 'Definition 1', description: 'Test definition' }
        ]
      }
    };

    inputDefineService.setDefineJson(testData);
    expect(inputDefineService.setDefineJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputDefineService.clear();
    expect(inputDefineService.clear).toHaveBeenCalled();
  });
});
