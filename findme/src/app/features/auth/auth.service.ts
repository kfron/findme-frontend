import { AuthResponse } from './containers/auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl = "http://10.0.2.2:3000/";

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return (this.http.post(this.serverUrl+"users/login", {email: email, password: password}) as Observable<AuthResponse>);
  }

  signup(name: string, surname: string, email: string, mobile: string, password: string, isAdmin: boolean): Observable<AuthResponse> {
    return (this.http.post(this.serverUrl+"users/signup", {name, surname, email, mobile, password, isAdmin}) as Observable<AuthResponse>);
  }

}
