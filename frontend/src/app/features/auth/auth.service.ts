import { Error, User } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";

  public currentUser: User;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Error | User> {
    return (this.http.post(this.serverUrl+"users/login", {email: email, password: password}) as Observable<Error | User>);
  }

  signup(user: User): Observable<Error | User> {
    return (this.http.post(this.serverUrl+"users/signup", user) as Observable<Error | User>);
  }

}
