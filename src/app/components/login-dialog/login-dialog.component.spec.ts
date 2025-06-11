import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginDialogComponent } from './login-dialog.component';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with validators', () => {
    component.ngOnInit();
    
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should handle goToLink method', () => {
    spyOn(window, 'open');
    
    component.goToLink();
    
    expect(window.open).toHaveBeenCalled();
  });

  it('should initialize with default values', () => {
    expect(component.loginError).toBe(false);
    expect(component.connecting).toBe(false);
  });
});
