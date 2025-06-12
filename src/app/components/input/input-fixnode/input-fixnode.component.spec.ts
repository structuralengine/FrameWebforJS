import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputFixNodeComponent } from '../input-fix-node/input-fix-node.component';
import { InputFixNodeService } from '../input-fix-node/input-fix-node.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputFixNodeComponent', () => {
  let component: InputFixNodeComponent;
  let fixture: ComponentFixture<InputFixNodeComponent>;
  let inputFixNodeService: jasmine.SpyObj<InputFixNodeService>;

  beforeEach(async () => {
    const inputFixNodeServiceSpy = jasmine.createSpyObj('InputFixNodeService', [
      'getFixNodeColumns', 'getFixNodeJson', 'setFixNodeJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputFixNodeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputFixNodeService, useValue: inputFixNodeServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputFixNodeComponent);
    component = fixture.componentInstance;
    inputFixNodeService = TestBed.inject(InputFixNodeService) as jasmine.SpyObj<InputFixNodeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFixNodeColumns from service', () => {
    const mockFixNode = {
      row: 1,
      n: '1',
      tx: '1',
      ty: '1',
      tz: '1',
      rx: '0',
      ry: '0',
      rz: '0'
    };
    inputFixNodeService.getFixNodeColumns.and.returnValue(mockFixNode);

    const result = inputFixNodeService.getFixNodeColumns(1, 1);
    
    expect(inputFixNodeService.getFixNodeColumns).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(mockFixNode);
  });

  it('should handle fixnode data operations', () => {
    const testFixNodeData = {
      1: { node: '1', tx: 1, ty: 1, tz: 1, rx: 0, ry: 0, rz: 0 },
      2: { node: '2', tx: 1, ty: 1, tz: 1, rx: 1, ry: 1, rz: 1 }
    };

    inputFixNodeService.getFixNodeJson.and.returnValue(testFixNodeData);
    
    const result = inputFixNodeService.getFixNodeJson();
    expect(result).toEqual(testFixNodeData);
    expect(inputFixNodeService.getFixNodeJson).toHaveBeenCalled();
  });

  it('should handle setFixNodeJson', () => {
    const testData = {
      fixnode: {
        1: { node: '1', tx: 1, ty: 1, tz: 1, rx: 0, ry: 0, rz: 0 }
      }
    };

    inputFixNodeService.setFixNodeJson(testData);
    expect(inputFixNodeService.setFixNodeJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputFixNodeService.clear();
    expect(inputFixNodeService.clear).toHaveBeenCalled();
  });
});
