import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputPanelComponent } from './input-panel.component';
import { InputPanelService } from './input-panel.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputPanelComponent', () => {
  let component: InputPanelComponent;
  let fixture: ComponentFixture<InputPanelComponent>;
  let inputPanelService: jasmine.SpyObj<InputPanelService>;

  beforeEach(async () => {
    const inputPanelServiceSpy = jasmine.createSpyObj('InputPanelService', [
      'getPanelColumns', 'getPanelJson', 'setPanelJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputPanelComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputPanelService, useValue: inputPanelServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputPanelComponent);
    component = fixture.componentInstance;
    inputPanelService = TestBed.inject(InputPanelService) as jasmine.SpyObj<InputPanelService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPanelColumns from service', () => {
    const mockPanel = {
      row: 1,
      e: '1',
      'point-1': '1',
      'point-2': '2',
      'point-3': '3',
      'point-4': '4'
    };
    inputPanelService.getPanelColumns.and.returnValue(mockPanel);

    const result = inputPanelService.getPanelColumns(1);
    
    expect(inputPanelService.getPanelColumns).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPanel);
  });

  it('should handle panel data operations', () => {
    const testPanelData = {
      1: { id: '1', e: '1', n1: '1', n2: '2', n3: '3', n4: '4' }
    };

    inputPanelService.getPanelJson.and.returnValue(testPanelData);
    
    const result = inputPanelService.getPanelJson();
    expect(result).toEqual(testPanelData);
    expect(inputPanelService.getPanelJson).toHaveBeenCalled();
  });

  it('should handle setPanelJson', () => {
    const testData = {
      panel: {
        1: { id: '1', e: '1', n1: '1', n2: '2', n3: '3', n4: '4' }
      }
    };

    inputPanelService.setPanelJson(testData);
    expect(inputPanelService.setPanelJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputPanelService.clear();
    expect(inputPanelService.clear).toHaveBeenCalled();
  });
});
