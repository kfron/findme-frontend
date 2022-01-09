import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './auth.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
  private serverUrl = "http://10.0.2.2:5000/";

  public currentUser: User;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User> {
    let login$ = (this.http.post(this.serverUrl + "users/login", { email: email, password: password }) as Observable<User>);
    login$.pipe(
      tap(res => this.currentUser = res)
    )
    return login$;
  }

  signup(user: User): Observable<User> {
    return (this.http.post(this.serverUrl + "users/signup", user) as Observable<User>);
  }

}
