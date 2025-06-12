import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputPickupComponent } from './input-pickup.component';
import { InputPickupService } from './input-pickup.service';
import { DataHelperModule } from '../../../providers/data-helper.module';

describe('InputPickupComponent', () => {
  let component: InputPickupComponent;
  let fixture: ComponentFixture<InputPickupComponent>;
  let inputPickupService: jasmine.SpyObj<InputPickupService>;

  beforeEach(async () => {
    const inputPickupServiceSpy = jasmine.createSpyObj('InputPickupService', [
      'getPickUpDataColumns', 'getPickUpJson', 'setPickUpJson', 'clear'
    ]);
    const helperServiceSpy = jasmine.createSpyObj('DataHelperModule', [
      'toNumber'
    ]);

    await TestBed.configureTestingModule({
      declarations: [InputPickupComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: InputPickupService, useValue: inputPickupServiceSpy },
        { provide: DataHelperModule, useValue: helperServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputPickupComponent);
    component = fixture.componentInstance;
    inputPickupService = TestBed.inject(InputPickupService) as jasmine.SpyObj<InputPickupService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPickUpDataColumns from service', () => {
    const mockPickup = {
      row: 1,
      name: 'Pickup 1',
      C1: '1.0',
      C2: '0.5'
    };
    inputPickupService.getPickUpDataColumns.and.returnValue(mockPickup);

    const result = inputPickupService.getPickUpDataColumns(1, 3);
    
    expect(inputPickupService.getPickUpDataColumns).toHaveBeenCalledWith(1, 3);
    expect(result).toEqual(mockPickup);
  });

  it('should handle pickup data operations', () => {
    const testPickupData = {
      1: [
        { row: 1, name: 'Pickup 1', C1: '1.0', C2: '0.5' }
      ]
    };

    inputPickupService.getPickUpJson.and.returnValue(testPickupData);
    
    const result = inputPickupService.getPickUpJson();
    expect(result).toEqual(testPickupData);
    expect(inputPickupService.getPickUpJson).toHaveBeenCalled();
  });

  it('should handle setPickUpJson', () => {
    const testData = {
      pickup: {
        1: [
          { row: 1, name: 'Pickup 1', C1: '1.0', C2: '0.5' }
        ]
      }
    };

    inputPickupService.setPickUpJson(testData);
    expect(inputPickupService.setPickUpJson).toHaveBeenCalledWith(testData);
  });

  it('should handle clear operation', () => {
    inputPickupService.clear();
    expect(inputPickupService.clear).toHaveBeenCalled();
  });
});
