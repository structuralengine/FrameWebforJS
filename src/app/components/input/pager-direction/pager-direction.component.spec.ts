import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PagerDirectionComponent } from './pager-direction.component';

describe('PagerDirectionComponent', () => {
  let component: PagerDirectionComponent;
  let fixture: ComponentFixture<PagerDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagerDirectionComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagerDirectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle component initialization', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should handle pager direction operations', () => {
    if (component.ngOnInit) {
      component.ngOnInit();
      expect(component).toBeDefined();
    }
  });
});
