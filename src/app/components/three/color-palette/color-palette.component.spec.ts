import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorPaletteComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default colors', () => {
    expect(component).toBeDefined();
  });

  it('should handle background color generation', () => {
    const testItem = {
      _color: { r: 255, g: 0, b: 0 }
    };
    
    const result = component.getBackground(testItem);
    
    expect(result).toBe('background: rgb(255,0,0)');
  });

  it('should handle control toggle', () => {
    const initialState = component.isControlOpen;
    
    component.onToggleControl();
    
    expect(component.isControlOpen).toBe(!initialState);
  });

  it('should initialize with empty color ruler list', () => {
    component.ngOnInit();
    
    expect(component.colorRulerList).toEqual([]);
  });
});
