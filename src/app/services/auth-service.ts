import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Login } from '../models/Login';
import ht from '@angular/common/locales/ht';
import { environment } from '../../environments/environment.development';
import lo from '@angular/common/locales/lo';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import th from '@angular/common/locales/th';
import { profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 ApiUrl=environment.ApiUrl
  constructor(private http:HttpClient){}
  
  AuthenticationSignal=signal<boolean|null>(null);
  IsLoggedin=this.AuthenticationSignal.asReadonly()
  currentUser=signal<profile|null>(null)



  login(form:any)
  {
    return this.http.post<LoginResponse>(this.ApiUrl+"/identity/token",form).pipe(
      tap(response=>{
     
     this.AuthenticationSignal.set(true)
      })
    )
  }


  refreshTheToken()
  {
     return this.http.get<string>(this.ApiUrl+"/token/refresh")
  }

  logout()
  {
   return this.http.get(this.ApiUrl+"/identity/logout").subscribe({
    next:()=>{
      
      this.AuthenticationSignal.set(false)
    },
    error(err){
      console.error(err)
    }
   }

   )

   
  }
  isInitialized = signal<boolean>(false); 

async checkAuthStatus(): Promise<boolean> {
  try {

    const user = await firstValueFrom(
      this.http.get<profile>(this.ApiUrl+'/profile', { withCredentials: true })
    );
    this.currentUser.set(user);
    this.AuthenticationSignal.set(true);
    this.isInitialized.set(true);
    console.log(this.currentUser.name)
    return true;
  } catch (error) {
    
    this.AuthenticationSignal.set(false);
    this.isInitialized.set(true); 
    return false; 
  }
}

}
