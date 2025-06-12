import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import { DataHelperModule } from './providers/data-helper.module';
import { PrintService } from './components/print/print.service';

describe('AppService', () => {
  let service: AppService;
  let helperSpy: jasmine.SpyObj<DataHelperModule>;
  let printServiceSpy: jasmine.SpyObj<PrintService>;

  beforeEach(() => {
    const helperSpyObj = jasmine.createSpyObj('DataHelperModule', ['isContentsDailogShow']);
    const printSpyObj = jasmine.createSpyObj('PrintService', ['resetPrintOption', 'clearPrintCase'], {
      printTargetValues: [{ value: true }, { value: false }]
    });

    TestBed.configureTestingModule({
      providers: [
        AppService,
        { provide: DataHelperModule, useValue: helperSpyObj },
        { provide: PrintService, useValue: printSpyObj }
      ]
    });
    service = TestBed.inject(AppService);
    helperSpy = TestBed.inject(DataHelperModule) as jasmine.SpyObj<DataHelperModule>;
    printServiceSpy = TestBed.inject(PrintService) as jasmine.SpyObj<PrintService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.dataPreset).toEqual([]);
    expect(service.presetLink).toBe('./assets/preset/');
    expect(service.fileSelected).toBeUndefined();
  });

  it('should close dialog and reset print dialog', () => {
    spyOn(service, 'addHiddenFromElements');
    spyOn(service, 'resetPrintdialog');
    
    service.dialogClose();
    
    expect(helperSpy.isContentsDailogShow).toBe(false);
    expect(service.addHiddenFromElements).toHaveBeenCalled();
    expect(service.resetPrintdialog).toHaveBeenCalled();
  });

  it('should reset print dialog values', () => {
    printServiceSpy.printTargetValues = [{ value: true }, { value: true }];
    
    service.resetPrintdialog();
    
    expect(printServiceSpy.printTargetValues[0].value).toBe(false);
    expect(printServiceSpy.printTargetValues[1].value).toBe(false);
    expect(printServiceSpy.resetPrintOption).toHaveBeenCalled();
    expect(printServiceSpy.clearPrintCase).toHaveBeenCalled();
  });

  it('should add hidden class to elements', () => {
    spyOn(service as any, 'addHiddenFromClass');
    
    service.addHiddenFromElements();
    
    expect((service as any).addHiddenFromClass).toHaveBeenCalledWith('.panel-element-content-container');
    expect((service as any).addHiddenFromClass).toHaveBeenCalledWith('#my_dock_manager');
    expect((service as any).addHiddenFromClass).toHaveBeenCalledWith('.dialog-floating');
  });

  it('should add hidden class to specific element', () => {
    const mockElement = {
      classList: {
        add: jasmine.createSpy('add')
      }
    };
    spyOn(document, 'querySelector').and.returnValue(mockElement as any);
    
    (service as any).addHiddenFromClass('.test-selector');
    
    expect(document.querySelector).toHaveBeenCalledWith('.test-selector');
    expect(mockElement.classList.add).toHaveBeenCalledWith('hidden');
  });

  it('should handle null element when adding hidden class', () => {
    spyOn(document, 'querySelector').and.returnValue(null);
    
    expect(() => {
      (service as any).addHiddenFromClass('.non-existent');
    }).not.toThrow();
  });
});
