import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultPickupDisgComponent } from './result-pickup-disg.component';

describe('ResultPickupDisgComponent', () => {
  let component: ResultPickupDisgComponent;
  let fixture: ComponentFixture<ResultPickupDisgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultPickupDisgComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultPickupDisgComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle component initialization', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });
});
