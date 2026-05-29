import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { AuthenticationManagerService } from '../../core/services/authentication-manager.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private authService: AuthenticationManagerService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.isAuthRequest(req)) {
      return next.handle(req);
    }

    const token = this.storageService.getAccessToken();
    if (token) {
      if (this.storageService.isTokenExpired(token)) {
        this.authService.logout();
      } else {
        req = req.clone({
          url: req.url,
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(req);
  }

  private isAuthRequest(req: HttpRequest<any>): boolean {
    return req.url.endsWith('/login') || req.url.endsWith('/register');
  }
}
