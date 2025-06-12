import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MaxMinComponent } from './max-min.component';

describe('MaxMinComponent', () => {
  let component: MaxMinComponent;
  let fixture: ComponentFixture<MaxMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaxMinComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaxMinComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component).toBeDefined();
  });

  it('should handle setValue method', () => {
    const testMaxValue = '100.5';
    const testMinValue = '-50.2';
    
    component.setValue(testMaxValue, testMinValue);
    
    expect(component.max_Three).toBe(testMaxValue);
    expect(component.min_Three).toBe(testMinValue);
  });

  it('should initialize with empty string values', () => {
    expect(component.max_Three).toBe('');
    expect(component.min_Three).toBe('');
  });

  it('should have max_min service dependency', () => {
    expect(component.max_min).toBeDefined();
  });
});
