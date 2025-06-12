import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputJointComponent } from './input-joint.component';
import { InputJointService } from './input-joint.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputJointComponent', () => {
  let component: InputJointComponent;
  let fixture: ComponentFixture<InputJointComponent>;
  let inputJointService: jasmine.SpyObj<InputJointService>;

  beforeEach(async () => {
    const inputJointServiceSpy = jasmine.createSpyObj('InputJointService', [
      'getJointColumns', 'getJointJson', 'setJointJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputJointComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputJointService, useValue: inputJointServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputJointComponent);
    component = fixture.componentInstance;
    inputJointService = TestBed.inject(InputJointService) as jasmine.SpyObj<InputJointService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getJointColumns from service', () => {
    const mockJoint = {
      row: 1,
      m: '1',
      xi: '1',
      yi: '2',
      zi: '3',
      xj: '4',
      yj: '5',
      zj: '6'
    };
    inputJointService.getJointColumns.and.returnValue(mockJoint);

    const result = inputJointService.getJointColumns(1, 1);
    
    expect(inputJointService.getJointColumns).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(mockJoint);
  });

  it('should handle joint data operations', () => {
    const testJointData = {
      1: { id: '1', xi: '1', yi: '2', zi: '3', xj: '4', yj: '5', zj: '6' }
    };

    inputJointService.getJointJson.and.returnValue(testJointData);
    
    const result = inputJointService.getJointJson();
    expect(result).toEqual(testJointData);
    expect(inputJointService.getJointJson).toHaveBeenCalled();
  });

  it('should handle setJointJson', () => {
    const testData = {
      joint: {
        1: { id: '1', xi: '1', yi: '2', zi: '3', xj: '4', yj: '5', zj: '6' }
      }
    };

    inputJointService.setJointJson(testData);
    expect(inputJointService.setJointJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputJointService.clear();
    expect(inputJointService.clear).toHaveBeenCalled();
  });
});
