import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Login } from '../models/Login';
import { environment } from '../../environments/environment.development';
import { firstValueFrom, of, tap } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { profile } from '../models/profile';
import { RegisterRequest } from '../models/RegisterRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ApiUrl = environment.ApiUrl + '/identity';
  constructor(private http: HttpClient) {}

  AuthenticationSignal = signal<boolean | null>(null);
  IsLoggedin = this.AuthenticationSignal.asReadonly();
  currentUser = signal<profile | null>(null);

  login(form: any) {
    return this.http.post<LoginResponse>(this.ApiUrl + '/token', form).pipe(
      tap(() => {
        this.AuthenticationSignal.set(true);
      }),
    );
  }

  register(form: RegisterRequest) {
    return this.http.post<any>(this.ApiUrl + '/register', form);
  }

  refreshTheToken() {
    return this.http.get<string>(this.ApiUrl + '/refresh-token');
  }

  logout() {
    return this.http.get(this.ApiUrl + '/logout').pipe(
      tap(() => {
        this.AuthenticationSignal.set(false);
      }),
    );
  }

  isInitialized = signal<boolean>(false);

  async checkAuthStatus(): Promise<boolean> {
    try {
      const user = await firstValueFrom(
        this.http.get<profile>(this.ApiUrl + '/profile', { withCredentials: true }),
      );
      this.currentUser.set(user);
      this.AuthenticationSignal.set(true);
      this.isInitialized.set(true);
      return true;
    } catch (error) {
      this.AuthenticationSignal.set(false);
      this.isInitialized.set(true);
      return false;
    }
  }
}
