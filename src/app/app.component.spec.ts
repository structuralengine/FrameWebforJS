import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ElementRef } from '@angular/core';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { InputDataService } from './providers/input-data.service';
import { ResultDataService } from './providers/result-data.service';
import { UserInfoService } from './providers/user-info.service';
import { LanguagesService } from './providers/languages.service';
import { DataHelperModule } from './providers/data-helper.module';
import { PrintService } from './components/print/print.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: jasmine.SpyObj<AppService>;
  let inputDataService: jasmine.SpyObj<InputDataService>;
  let resultDataService: jasmine.SpyObj<ResultDataService>;

  beforeEach(async () => {
    const appServiceSpy = jasmine.createSpyObj('AppService', ['dialogClose']);
    const inputDataServiceSpy = jasmine.createSpyObj('InputDataService', ['getInputJson', 'getResult']);
    const resultDataServiceSpy = jasmine.createSpyObj('ResultDataService', ['clear', 'loadResultData']);
    const userInfoServiceSpy = jasmine.createSpyObj('UserInfoService', ['userProfile']);
    const languagesServiceSpy = jasmine.createSpyObj('LanguagesService', ['tranText', 'browserLang']);
    const helperSpy = jasmine.createSpyObj('DataHelperModule', ['alert', 'confirm']);
    const printServiceSpy = jasmine.createSpyObj('PrintService', ['mode']);
    const elementRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        NgbModule,
        AngularFireModule.initializeApp({})
      ],
      providers: [
        { provide: AppService, useValue: appServiceSpy },
        { provide: InputDataService, useValue: inputDataServiceSpy },
        { provide: ResultDataService, useValue: resultDataServiceSpy },
        { provide: UserInfoService, useValue: userInfoServiceSpy },
        { provide: LanguagesService, useValue: languagesServiceSpy },
        { provide: DataHelperModule, useValue: helperSpy },
        { provide: PrintService, useValue: printServiceSpy },
        { provide: ElementRef, useValue: elementRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appService = TestBed.inject(AppService) as jasmine.SpyObj<AppService>;
    inputDataService = TestBed.inject(InputDataService) as jasmine.SpyObj<InputDataService>;
    resultDataService = TestBed.inject(ResultDataService) as jasmine.SpyObj<ResultDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.translateY).toBe('translateY(0)');
    expect(component.isToggled).toBe(true);
    expect(component.dragPosition).toEqual({ x: 0, y: 0 });
  });

  it('should call helper.isContentsDailogShow = false on ngOnInit', () => {
    component.ngOnInit();
    expect(component.helper.isContentsDailogShow).toBe(false);
  });

  it('should handle scroll event', () => {
    const mockEvent = {
      srcElement: { scrollTop: 100 }
    };
    
    component.onScroll(mockEvent);
    expect(component.translateY).toBe('translateY(-100px)');
  });

  it('should disable result buttons', () => {
    component.disableResultButton();
    expect(component.fsec.clear).toHaveBeenCalled();
    expect(component.disg.clear).toHaveBeenCalled();
    expect(component.reac.clear).toHaveBeenCalled();
  });

  it('should call appService.dialogClose', () => {
    component.dialogClose();
    expect(appService.dialogClose).toHaveBeenCalled();
  });

  it('should toggle isToggled', () => {
    const initialValue = component.isToggled;
    component.toggle();
    expect(component.isToggled).toBe(!initialValue);
  });

  it('should handle pager event', () => {
    spyOn(component.pagerEvent, 'emit');
    const testData = 5;
    
    component.onPagerEvent(testData);
    expect(component.pagerEvent.emit).toHaveBeenCalledWith(testData);
  });

  it('should handle event from child', () => {
    const testEvent = 10;
    component.onReceiveEventFromChild(testEvent);
    expect(component.eventFromChild).toBe(testEvent);
  });

  it('should get displacement link based on case', () => {
    component.disg.isCalculated = true;
    component.ResultData.case = 'basic';
    expect(component.getDisgLink()).toBe('./result-disg');
    
    component.ResultData.case = 'comb';
    expect(component.getDisgLink()).toBe('./result-comb_disg');
    
    component.ResultData.case = 'pic';
    expect(component.getDisgLink()).toBe('./result-pic_disg');
  });

  it('should get reaction link based on case', () => {
    component.disg.isCalculated = true;
    component.ResultData.case = 'basic';
    expect(component.getReacLink()).toBe('./result-reac');
    
    component.ResultData.case = 'comb';
    expect(component.getReacLink()).toBe('./result-comb_reac');
    
    component.ResultData.case = 'pic';
    expect(component.getReacLink()).toBe('./result-pic_reac');
  });

  it('should get section force link based on case', () => {
    component.disg.isCalculated = true;
    component.ResultData.case = 'basic';
    expect(component.getFsecLink()).toBe('./result-fsec');
    
    component.ResultData.case = 'comb';
    expect(component.getFsecLink()).toBe('./result-comb_fsec');
    
    component.ResultData.case = 'pic';
    expect(component.getFsecLink()).toBe('./result-pic_fsec');
  });
});
