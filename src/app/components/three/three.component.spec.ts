import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgZone } from '@angular/core';

import { ThreeComponent } from './three.component';
import { ThreeService } from './three.service';
import { SceneService } from './scene.service';
import { MaxMinService } from './max-min/max-min.service';

describe('ThreeComponent', () => {
  let component: ThreeComponent;
  let fixture: ComponentFixture<ThreeComponent>;
  let threeService: jasmine.SpyObj<ThreeService>;
  let sceneService: jasmine.SpyObj<SceneService>;

  beforeEach(async () => {
    const threeServiceSpy = jasmine.createSpyObj('ThreeService', [
      'OnInit', 'detectObject'
    ], {
      canvasWidth: '800px',
      canvasHeight: '600px',
      canvasElement: null,
      fileName: 'test.json',
      mode: 'nodes'
    });
    const sceneServiceSpy = jasmine.createSpyObj('SceneService', [
      'OnInit', 'labelRendererDomElement', 'render', 'getBoundingClientRect', 
      'onResize', 'resetCamera'
    ]);
    const maxMinServiceSpy = jasmine.createSpyObj('MaxMinService', [], {
      index: 1,
      radio: 'axialForce'
    });
    const ngZoneSpy = jasmine.createSpyObj('NgZone', ['runOutsideAngular']);

    await TestBed.configureTestingModule({
      declarations: [ThreeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ThreeService, useValue: threeServiceSpy },
        { provide: SceneService, useValue: sceneServiceSpy },
        { provide: MaxMinService, useValue: maxMinServiceSpy },
        { provide: NgZone, useValue: ngZoneSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreeComponent);
    component = fixture.componentInstance;
    threeService = TestBed.inject(ThreeService) as jasmine.SpyObj<ThreeService>;
    sceneService = TestBed.inject(SceneService) as jasmine.SpyObj<SceneService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with service dependencies', () => {
    expect(component.scene).toBe(sceneService);
  });

  it('should have contentsDialog defined', () => {
    expect(component.contentsDialog).toBeDefined();
    expect(component.contentsDialog.nodes).toContain('図');
    expect(component.contentsDialog.members).toBe('部材図');
    expect(component.contentsDialog.disg).toBe('変位量図');
  });

  it('should have direction defined', () => {
    expect(component.direction).toBeDefined();
    expect(component.direction.axialForce).toBe('軸方向力');
    expect(component.direction.shearForceY).toBe('y軸方向のせん断力');
    expect(component.direction.torsionalMoment).toBe('ねじりモーメント');
  });

  it('should call scene OnInit on ngAfterViewInit', () => {
    spyOn(document, 'getElementById').and.returnValue({
      parentNode: {
        insertBefore: jasmine.createSpy('insertBefore')
      }
    } as any);
    sceneService.labelRendererDomElement.and.returnValue(document.createElement('div'));
    
    component.ngAfterViewInit();
    
    expect(sceneService.OnInit).toHaveBeenCalled();
    expect(threeService.OnInit).toHaveBeenCalled();
  });

  it('should handle mouse down events', () => {
    const mockEvent = new MouseEvent('pointerdown', {
      clientX: 100,
      clientY: 200
    });
    sceneService.getBoundingClientRect.and.returnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600
    } as DOMRect);

    component.onMouseDown(mockEvent);
    
    expect(threeService.detectObject).toHaveBeenCalled();
  });

  it('should handle mouse up events', () => {
    const mockEvent = new MouseEvent('pointerup', {
      clientX: 100,
      clientY: 200
    });
    sceneService.getBoundingClientRect.and.returnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600
    } as DOMRect);

    component.onMouseUp(mockEvent);
    
    expect(threeService.detectObject).toHaveBeenCalled();
  });

  it('should handle window resize events', () => {
    const mockEvent = new Event('resize');
    
    component.onResize(mockEvent);
    
    expect(sceneService.onResize).toHaveBeenCalled();
  });

  it('should handle onToggleHome', () => {
    component.onToggleHome();
    
    expect(sceneService.resetCamera).toHaveBeenCalled();
    expect(sceneService.render).toHaveBeenCalled();
  });

  it('should handle downloadImage', () => {
    spyOn(document, 'getElementById').and.returnValue({
      style: { width: '', height: '' }
    } as any);
    
    const mockCanvas = {
      toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/png;base64,test')
    };
    
    expect(component.downloadImage).toBeDefined();
    expect(typeof component.downloadImage).toBe('function');
  });
});
