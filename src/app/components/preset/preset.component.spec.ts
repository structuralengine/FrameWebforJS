import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PresetComponent } from './preset.component';
import { DataHelperModule } from '../../providers/data-helper.module';

describe('PresetComponent', () => {
  let component: PresetComponent;
  let fixture: ComponentFixture<PresetComponent>;

  beforeEach(async () => {
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [PresetComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PresetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component).toBeDefined();
  });

  it('should handle page back navigation', () => {
    spyOn(component['appService'], 'addHiddenFromElements').and.stub();
    
    component.onPageBack();
    
    expect(component.helper.isContentsDailogShow).toBe(false);
    expect(component['appService'].addHiddenFromElements).toHaveBeenCalled();
  });

  it('should handle dimension setting', () => {
    const initialDimension = component.helper.dimension;
    
    component.setDimension(3);
    
    expect(component.helper.dimension).toBe(3);
  });
});
