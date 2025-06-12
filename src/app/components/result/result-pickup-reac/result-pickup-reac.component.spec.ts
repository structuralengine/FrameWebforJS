import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultPickupReacComponent } from './result-pickup-reac.component';

describe('ResultPickupReacComponent', () => {
  let component: ResultPickupReacComponent;
  let fixture: ComponentFixture<ResultPickupReacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultPickupReacComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultPickupReacComponent);
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
