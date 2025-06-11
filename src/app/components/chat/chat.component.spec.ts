import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty messages', () => {
    expect(component).toBeDefined();
  });

  it('should have type input property', () => {
    const testType = 'text/javascript';
    component.type = testType;
    expect(component.type).toBe(testType);
  });

  it('should handle ngAfterViewInit', () => {
    spyOn(document, 'createElement').and.callThrough();
    
    component.ngAfterViewInit();
    
    expect(document['__cp_d']).toBe('https://app.chatplus.jp');
    expect(document['__cp_c']).toBe('a4ef5c36_1');
  });

  it('should initialize with undefined type', () => {
    expect(component.type).toBeUndefined();
  });
});
