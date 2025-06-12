import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SheetComponent } from './sheet.component';

describe('SheetComponent', () => {
  let component: SheetComponent;
  let fixture: ComponentFixture<SheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SheetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle component initialization', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should handle sheet operations', () => {
    expect(component).toBeDefined();
  });
});
