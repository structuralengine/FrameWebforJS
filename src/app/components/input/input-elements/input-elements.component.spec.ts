import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputElementsComponent } from './input-elements.component';
import { InputElementsService } from './input-elements.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputElementsComponent', () => {
  let component: InputElementsComponent;
  let fixture: ComponentFixture<InputElementsComponent>;
  let inputElementsService: jasmine.SpyObj<InputElementsService>;

  beforeEach(async () => {
    const inputElementsServiceSpy = jasmine.createSpyObj('InputElementsService', [
      'getElementColumns', 'getElementJson', 'setElementJson', 'clear', 'getElementName'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputElementsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputElementsService, useValue: inputElementsServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputElementsComponent);
    component = fixture.componentInstance;
    inputElementsService = TestBed.inject(InputElementsService) as jasmine.SpyObj<InputElementsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getElementColumns from service', () => {
    const mockElement = {
      id: '1',
      E: '2.00e+5',
      G: '8.00e+4',
      Xp: '',
      A: '0.0100',
      J: '0.000001',
      Iy: '0.000001',
      Iz: '0.000001',
      n: 'Steel Element'
    };
    inputElementsService.getElementColumns.and.returnValue(mockElement);

    const result = inputElementsService.getElementColumns(1, 1);
    
    expect(inputElementsService.getElementColumns).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(mockElement);
  });

  it('should handle element data operations', () => {
    const testElementData = {
      steel: {
        1: { name: 'Steel S400', E: 200000, G: 80000, A: 0.01 }
      },
      concrete: {
        1: { name: 'Concrete FC24', E: 24000, G: 10000, A: 0.02 }
      }
    };

    inputElementsService.getElementJson.and.returnValue(testElementData);
    
    const result = inputElementsService.getElementJson();
    expect(result).toEqual(testElementData);
    expect(inputElementsService.getElementJson).toHaveBeenCalled();
  });

  it('should handle setElementJson', () => {
    const testData = {
      element: {
        steel: {
          1: { name: 'Steel S400', E: 200000, G: 80000, A: 0.01 }
        }
      }
    };

    inputElementsService.setElementJson(testData);
    expect(inputElementsService.setElementJson).toHaveBeenCalledWith(testData);
  });

  it('should handle getElementName', () => {
    inputElementsService.getElementName.and.returnValue('Steel S400');

    const result = inputElementsService.getElementName('1');
    
    expect(inputElementsService.getElementName).toHaveBeenCalledWith('1');
    expect(result).toBe('Steel S400');
  });

  it('should handle clear operation', () => {
    inputElementsService.clear();
    expect(inputElementsService.clear).toHaveBeenCalled();
  });
});
