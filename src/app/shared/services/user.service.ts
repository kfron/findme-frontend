import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Observable, tap } from 'rxjs';
import { Ad } from '../models/ads.model';
import { User } from '../models/auth.model';
import { ApiPaths, environment } from './../../../../environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	baseUrl = environment.baseUrl;

	private _currentUser: User;

	constructor(private http: HttpClient) { }

	private mapAd(ad): Ad {
		ad.found_at = new Date(ad.found_at);
		ad.image = `${this.baseUrl}/${ad.image}`;
		ad.lastKnownPosition = Position.positionFromLatLng(ad.lat, ad.lon);
		delete ad.lat;
		delete ad.lon;
		return ad as Ad;
	}

	login(email: string, password: string): Observable<User> {
		const url = `${this.baseUrl}/${ApiPaths.users}/login`;
		const observable = (this.http.post(url, { email: email, password: password }) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	signup(user: User): Observable<User> {
		const url = `${this.baseUrl}/${ApiPaths.users}/signup`;
		const observable = (this.http.post(url, user) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	changeEmail(email: string) {
		const url = `${this.baseUrl}/${ApiPaths.users}/changeEmail`;

		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('email', email);
		const observable = (this.http.put(url, params) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	changePassword(password: string) {
		const url = `${this.baseUrl}/${ApiPaths.users}/changePassword`;

		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('password', password);

		const observable = (this.http.put(url, params) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	getMyAds(): Observable<Ad[]> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getMyAds`;

		const params = new HttpParams()
			.set('id', +this.currentUser.id);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(ads => {
			ads.map(ad => this.mapAd(ad));
		})) as Observable<Ad[]>);
	}

	getMyPings(): Observable<Ad[]> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getMyPings`;

		const params = new HttpParams()
			.set('id', this.currentUser.id);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(ads => {
			ads.map(ad => this.mapAd(ad));
		})) as Observable<Ad[]>);
	}

	get currentUser(): User {
		return this._currentUser;
	}

	set currentUser(user: User) {
		this._currentUser = user;
	}

}
