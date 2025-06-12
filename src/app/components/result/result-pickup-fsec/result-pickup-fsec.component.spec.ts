import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ResultPickupFsecComponent } from './result-pickup-fsec.component';

describe('ResultPickupFsecComponent', () => {
  let component: ResultPickupFsecComponent;
  let fixture: ComponentFixture<ResultPickupFsecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultPickupFsecComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultPickupFsecComponent);
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
