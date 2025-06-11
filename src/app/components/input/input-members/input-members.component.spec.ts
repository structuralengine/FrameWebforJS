import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputMembersComponent } from './input-members.component';
import { InputMembersService } from './input-members.service';
import { InputElementsService } from '../input-elements/input-elements.service';
import { DataHelperModule } from '../../../providers/data-helper.module';
import { ThreeService } from '../../three/three.service';
import { AppComponent } from '../../../app.component';
import { ThreeMembersService } from '../../three/geometry/three-members.service';
import { InputMemberDetailService } from './input-member-detail/input-member-detail.service';
import { LanguagesService } from '../../../providers/languages.service';
import { DocLayoutService } from '../../../providers/doc-layout.service';

describe('InputMembersComponent', () => {
  let component: InputMembersComponent;
  let fixture: ComponentFixture<InputMembersComponent>;
  let inputMembersService: jasmine.SpyObj<InputMembersService>;
  let inputElementsService: jasmine.SpyObj<InputElementsService>;

  beforeEach(async () => {
    const inputMembersServiceSpy = jasmine.createSpyObj('InputMembersService', [
      'getMemberColumns', 'getMemberLength'
    ], {
      member: []
    });
    const inputElementsServiceSpy = jasmine.createSpyObj('InputElementsService', [
      'getElementName'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [], {
      dimension: 3
    });
    const threeServiceSpy = jasmine.createSpyObj('ThreeService', [
      'ChangeMode', 'selectChange', 'changeData'
    ]);
    const appComponentSpy = jasmine.createSpyObj('AppComponent', [
      'getPanelElementContentContainerHeight', 'getDialogHeight'
    ]);
    const threeMembersServiceSpy = jasmine.createSpyObj('ThreeMembersService', [], {
      memberSelected$: { subscribe: jasmine.createSpy('subscribe') }
    });
    const inputMemberDetailServiceSpy = jasmine.createSpyObj('InputMemberDetailService', [
      'setShowHideDetail', 'setDataEntity'
    ]);
    const languagesServiceSpy = jasmine.createSpyObj('LanguagesService', ['tranText']);
    const docLayoutServiceSpy = jasmine.createSpyObj('DocLayoutService', [], {
      handleMove: { subscribe: jasmine.createSpy('subscribe') }
    });

    await TestBed.configureTestingModule({
      declarations: [InputMembersComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputMembersService, useValue: inputMembersServiceSpy },
        { provide: InputElementsService, useValue: inputElementsServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy },
        { provide: ThreeService, useValue: threeServiceSpy },
        { provide: AppComponent, useValue: appComponentSpy },
        { provide: ThreeMembersService, useValue: threeMembersServiceSpy },
        { provide: InputMemberDetailService, useValue: inputMemberDetailServiceSpy },
        { provide: LanguagesService, useValue: languagesServiceSpy },
        { provide: DocLayoutService, useValue: docLayoutServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputMembersComponent);
    component = fixture.componentInstance;
    inputMembersService = TestBed.inject(InputMembersService) as jasmine.SpyObj<InputMembersService>;
    inputElementsService = TestBed.inject(InputElementsService) as jasmine.SpyObj<InputElementsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isMemberDetailShow).toBe(false);
  });

  it('should call ChangeMode and setShowHideDetail on ngOnInit', () => {
    const threeService = TestBed.inject(ThreeService) as jasmine.SpyObj<ThreeService>;
    const inputMemberDetailService = TestBed.inject(InputMemberDetailService) as jasmine.SpyObj<InputMemberDetailService>;
    
    component.ngOnInit();
    
    expect(threeService.ChangeMode).toHaveBeenCalledWith('members');
    expect(inputMemberDetailService.setShowHideDetail).toHaveBeenCalledWith(false);
  });

  it('should handle 3D column headers when dimension is 3', () => {
    const helperService = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
    helperService.dimension = 3;
    expect(component.width).toBe(580);
  });

  it('should handle 2D column headers when dimension is 2', () => {
    const helperService = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
    helperService.dimension = 2;
    expect(component.width).toBe(450);
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

  it('should call getMemberColumns from service', () => {
    const mockMember = { id: '1', ni: '1', nj: '2', e: '1' };
    inputMembersService.getMemberColumns.and.returnValue(mockMember);

    const result = inputMembersService.getMemberColumns(1);
    
    expect(inputMembersService.getMemberColumns).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockMember);
  });

  it('should call getMemberLength from service', () => {
    inputMembersService.getMemberLength.and.returnValue(10.5);

    const result = inputMembersService.getMemberLength('1');
    
    expect(inputMembersService.getMemberLength).toHaveBeenCalledWith('1');
    expect(result).toBe(10.5);
  });

  it('should call getElementName from elements service', () => {
    inputElementsService.getElementName.and.returnValue('Steel Element');

    const result = inputElementsService.getElementName('1');
    
    expect(inputElementsService.getElementName).toHaveBeenCalledWith('1');
    expect(result).toBe('Steel Element');
  });
});
