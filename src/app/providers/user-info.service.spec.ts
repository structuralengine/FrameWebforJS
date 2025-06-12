import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserInfoService } from './user-info.service';

describe('UserInfoService', () => {
  let service: UserInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserInfoService]
    });
    service = TestBed.inject(UserInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle user profile setting', () => {
    const testUserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      extension_Role: 'admin',
      malme_roles: 'user'
    };

    service.setUserProfile(testUserProfile);
    
    expect(service.userProfile).toEqual(testUserProfile);
  });

  it('should handle null user profile', () => {
    service.setUserProfile(null);
    
    expect(service.userProfile).toBeNull();
    expect(service.activeSession).toBeNull();
  });

  it('should initialize with default values', () => {
    expect(service.deduct_points).toBe(0);
    expect(service.new_points).toBe(0);
    expect(service.old_points).toBe(0);
    expect(service.clientId).toBeDefined();
  });

  it('should handle claims processing', () => {
    const testClaims = {
      sub: 'test-uid',
      email: 'test@example.com',
      given_name: 'Test',
      family_name: 'User'
    };

    const result = service.getClaims(testClaims);
    
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(4);
    expect(result[0]).toEqual({ id: 0, claim: 'sub', value: 'test-uid' });
  });
});
