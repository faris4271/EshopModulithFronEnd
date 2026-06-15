import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';


let isRefreshing = false;

const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
 const authReq=req.clone({withCredentials:true})
  if (req.url.includes('/identity/token') || req.url.includes('/token/refresh') || req.url.includes('/identity/logout')) {
    return next(authReq);
  }

 

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        
        if (isRefreshing) {
          return refreshTokenSubject.pipe(
            filter(result => result !== null), 
            take(1),
            switchMap((success) => {
              if (success) {
               
                return next(req.clone({ withCredentials: true }));
              } else {
           
                return throwError(() => error);
              }
            })
          );
        }

       
        isRefreshing = true;
        refreshTokenSubject.next(null); 

        return authService.refreshTheToken().pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshTokenSubject.next(true);
            authService.AuthenticationSignal.set(true);
            return next(req.clone({ withCredentials: true }));
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshTokenSubject.next(false); 
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      
      return throwError(() => error);
    })
  );
};