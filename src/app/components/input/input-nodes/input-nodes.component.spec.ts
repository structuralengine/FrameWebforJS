import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputNodesComponent } from './input-nodes.component';
import { InputNodesService } from './input-nodes.service';
import { DataHelperModule } from '../../../providers/data-helper.module';
import { ThreeService } from '../../three/three.service';
import { AppComponent } from '../../../app.component';
import { ThreeNodesService } from '../../three/geometry/three-nodes.service';
import { LanguagesService } from '../../../providers/languages.service';
import { DocLayoutService } from '../../../providers/doc-layout.service';

describe('InputNodesComponent', () => {
  let component: InputNodesComponent;
  let fixture: ComponentFixture<InputNodesComponent>;
  let inputNodesService: jasmine.SpyObj<InputNodesService>;
  let helperService: jasmine.SpyObj<DataHelperModule>;

  beforeEach(async () => {
    const inputNodesServiceSpy = jasmine.createSpyObj('InputNodesService', [
      'getNodeColumns', 'node'
    ], {
      node: []
    });
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ], {
      dimension: 3
    });
    const threeServiceSpy = jasmine.createSpyObj('ThreeService', [
      'ChangeMode', 'selectChange', 'changeData'
    ]);
    const appComponentSpy = jasmine.createSpyObj('AppComponent', [
      'getPanelElementContentContainerHeight', 'getDialogHeight'
    ]);
    const threeNodesServiceSpy = jasmine.createSpyObj('ThreeNodesService', [], {
      nodeSelected$: { subscribe: jasmine.createSpy('subscribe') }
    });
    const languagesServiceSpy = jasmine.createSpyObj('LanguagesService', ['tranText']);
    const docLayoutServiceSpy = jasmine.createSpyObj('DocLayoutService', [], {
      handleMove: { subscribe: jasmine.createSpy('subscribe') }
    });

    await TestBed.configureTestingModule({
      declarations: [InputNodesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputNodesService, useValue: inputNodesServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy },
        { provide: ThreeService, useValue: threeServiceSpy },
        { provide: AppComponent, useValue: appComponentSpy },
        { provide: ThreeNodesService, useValue: threeNodesServiceSpy },
        { provide: LanguagesService, useValue: languagesServiceSpy },
        { provide: DocLayoutService, useValue: docLayoutServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputNodesComponent);
    component = fixture.componentInstance;
    inputNodesService = TestBed.inject(InputNodesService) as jasmine.SpyObj<InputNodesService>;
    helperService = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.inner_width).toBe(290);
    expect(component.helper).toBe(helperService);
  });

  it('should call ChangeMode on ngOnInit', () => {
    const threeService = TestBed.inject(ThreeService) as jasmine.SpyObj<ThreeService>;
    
    component.ngOnInit();
    
    expect(threeService.ChangeMode).toHaveBeenCalledWith('nodes');
  });

  it('should handle 3D column headers when dimension is 3', () => {
    helperService.dimension = 3;
    expect(component.width).toBe(380);
  });

  it('should handle 2D column headers when dimension is 2', () => {
    helperService.dimension = 2;
    expect(component.width).toBe(290);
  });

  it('should use helper service for number operations', () => {
    helperService.toNumber.and.returnValue(10.5);

    const numberResult = component.helper.toNumber('10.5');

    expect(numberResult).toBe(10.5);
    expect(helperService.toNumber).toHaveBeenCalledWith('10.5');
  });

  it('should have grid options configured', () => {
    expect(component.options).toBeDefined();
    expect(component.options.showTop).toBe(false);
    expect(component.options.reactive).toBe(true);
    expect(component.options.sortable).toBe(false);
    expect(component.options.locale).toBe('jp');
  });

  it('should handle context menu items', () => {
    expect(component.options.contextMenu).toBeDefined();
    expect(component.options.contextMenu.on).toBe(true);
    expect(component.options.contextMenu.items).toBeDefined();
    expect(component.options.contextMenu.items.length).toBe(4);
  });
});
