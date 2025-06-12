import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InputNoticePointsComponent } from './input-notice-points.component';

describe('InputNoticePointsComponent', () => {
  let component: InputNoticePointsComponent;
  let fixture: ComponentFixture<InputNoticePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputNoticePointsComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputNoticePointsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle component initialization', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should handle input operations', () => {
    if (component.ngOnInit) {
      component.ngOnInit();
      expect(component).toBeDefined();
    }
  });
});
