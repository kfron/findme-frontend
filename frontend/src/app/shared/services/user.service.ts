import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ad } from '../models/ads.model';
import { User } from '../models/auth.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	//private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
	private serverUrl = 'http://10.0.2.2:5000/';

	private _currentUser: User;

	constructor(private http: HttpClient) { }

	login(email: string, password: string): Observable<User> {
		return (this.http.post(this.serverUrl + 'users/login', { email: email, password: password }) as Observable<User>);
	}

	signup(user: User): Observable<User> {
		return (this.http.post(this.serverUrl + 'users/signup', user) as Observable<User>);
	}

	changeEmail(email: string) {
		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('email', email);

		return (this.http.put(this.serverUrl + 'users/changeEmail', params));
	}

	changePassword(password: string) {
		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('password', password);

		return (this.http.put(this.serverUrl + 'users/changePassword', params));
	}

	getMyAds(): Observable<Ad[]> {
		const params = new HttpParams()
			.set('id', this.currentUser.id);
		return (this.http.get(this.serverUrl + 'ads/getMyAds', { params }) as Observable<Ad[]>);
	}

	getMyPings(): Observable<Ad[]> {
		const params = new HttpParams()
			.set('id', this.currentUser.id);
		return (this.http.get(this.serverUrl + 'ads/getMyPings', { params }) as Observable<Ad[]>);
	}

	get currentUser(): User {
		return this._currentUser;
	}

	set currentUser(user: User) {
		this._currentUser = user;
	}

}
