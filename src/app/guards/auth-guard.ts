import { inject } from '@angular/core';
import { CanActivateFn, Router, RouteReuseStrategy } from '@angular/router';
import { AuthService } from '../services/auth-service';
import fa from '@angular/common/locales/fa';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isInitialized()) {
    return authService.AuthenticationSignal() ? true : router.parseUrl('/login');
  }

  
  return toObservable(authService.isInitialized).pipe(
    filter(initialized => initialized === true), 
    take(1), 
    map(() => authService.AuthenticationSignal() ? true : router.parseUrl('/login'))
  );
};
