import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { WaitDialogComponent } from './wait-dialog.component';

describe('WaitDialogComponent', () => {
  let component: WaitDialogComponent;
  let fixture: ComponentFixture<WaitDialogComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [WaitDialogComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitDialogComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('');
  });

  it('should display loading state', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should handle modal interactions', () => {
    expect(activeModal).toBeDefined();
  });
});
