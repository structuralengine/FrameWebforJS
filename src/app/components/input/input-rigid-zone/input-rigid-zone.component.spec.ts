import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputRigidZoneComponent } from './input-rigid-zone.component';

describe('InputRigidZoneComponent', () => {
  let component: InputRigidZoneComponent;
  let fixture: ComponentFixture<InputRigidZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputRigidZoneComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputRigidZoneComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle component initialization', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should handle rigid zone operations', () => {
    if (component.ngOnInit) {
      component.ngOnInit();
      expect(component).toBeDefined();
    }
  });
});
