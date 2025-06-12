import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { StartMenuComponent } from './start-menu.component';

describe('StartMenuComponent', () => {
  let component: StartMenuComponent;
  let fixture: ComponentFixture<StartMenuComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [StartMenuComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle page back navigation', () => {
    spyOn(component['appService'], 'addHiddenFromElements');
    
    component.onPageBack();
    
    expect(component.helper.isContentsDailogShow).toBe(false);
    expect(component['appService'].addHiddenFromElements).toHaveBeenCalled();
  });

  it('should handle preset selection', () => {
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    spyOn(router, 'navigate');
    
    component.clickSelectPreset();
    
    expect(component.helper.isContentsDailogShow).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should handle file opening', () => {
    const mockEvent = { target: { files: [] } };
    spyOn(component.menuService, 'open');
    spyOn(router, 'navigate');
    
    component.clickOpenFile(mockEvent);
    
    expect(component.helper.isContentsDailogShow).toBe(false);
    expect(component.menuService.open).toHaveBeenCalledWith(mockEvent);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
