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
	
	get currentUser(): User {
		return this._currentUser;
	}

	set currentUser(user: User) {
		this._currentUser = user;
	}
	
	/**
	 * Mapuje pola zgłoszenia na ich poprawne odpowiedniki, usuwa niepotrzebne artefakty.
	 * 
	 * @param ad - zgłoszenie w surowej wersji
	 * @returns - poprawnie sformatowane zgłoszenie
	 */
	private mapAd(ad): Ad {
		ad.found_at = new Date(ad.found_at);
		ad.image = `${this.baseUrl}/${ad.image}`;
		ad.lastKnownPosition = Position.positionFromLatLng(ad.lat, ad.lon);
		delete ad.lat;
		delete ad.lon;
		return ad as Ad;
	}

	/**
	 * Wysyła żądanie typu POST z prośbą o zweryfikowanie użytkownika.
	 * Inicjalizuje zmienną przechowującą dane użytkownika.
	 * 
	 * @param email - email użytkownika 
	 * @param password - hasło użytkownika
	 * @returns - obiekt przechowujący dane użytkownika wraz z zaszyfrowanym hasłem
	 */
	login(email: string, password: string): Observable<User> {
		const url = `${this.baseUrl}/${ApiPaths.users}/login`;
		const observable = (this.http.post(url, { email: email, password: password }) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	/**
	 * Wysyła żądanie typu POST z prośbą o utworzenie użytkownika.
	 * Inicjalizuje zmienną przechowującą dane użytkownika.
	 * 
	 * @param user - dane do rejestracji użytkownika
	 * @returns - obiekt przechowujący dane użytkownika wraz z zaszyfrowanym hasłem
	 */
	signup(user: User): Observable<User> {
		const url = `${this.baseUrl}/${ApiPaths.users}/signup`;
		const observable = (this.http.post(url, user) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	/**
	 * Wysyła żądanie typu PUT z prośbą o aktualizację emaila użytkownika.
	 * Aktualizuje zmienną użytkownika.
	 * 
	 * @param email - nowy mail 
	 * @returns - obiekt przechowujący dane użytkownika wraz z zaszyfrowanym hasłem
	 */
	changeEmail(email: string) {
		const url = `${this.baseUrl}/${ApiPaths.users}/changeEmail`;

		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('email', email);
		const observable = (this.http.put(url, params) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	/**
	 * Wysyła żądanie typu PUT z prośbą o aktualizację hasła użytkownika.
	 * Aktualizuje zmienną użytkownika.
	 * 
	 * @param password - nowe hasło
	 * @returns - obiekt przechowujący dane użytkownika wraz z zaszyfrowanym hasłem
	 */
	changePassword(password: string) {
		const url = `${this.baseUrl}/${ApiPaths.users}/changePassword`;

		const params = new HttpParams()
			.set('id', this.currentUser.id)
			.set('password', password);

		const observable = (this.http.put(url, params) as Observable<User>);
		return (observable.pipe(
			tap(user => this.currentUser = user)));
	}

	/**
	 * Wysyła żądanie typu GET z prośbą o listę zgłoszeń użytkownika.
	 * 
	 * @returns listę poprawnie sformatowanych zgłoszeń użytkownika
	 */
	getMyAds(): Observable<Ad[]> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getMyAds`;

		const params = new HttpParams()
			.set('id', +this.currentUser.id);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(ads => {
			ads.map(ad => this.mapAd(ad));
		})) as Observable<Ad[]>);
	}

	/**
	 * Wysyła żądanie typu GET z prośbą o listę zgłoszeń, przy których pomagał użytkownik.
	 * 
	 * @returns listę poprawnie sformatowanych zgłoszeń, przy których pomagał użytkownik
	 */
	getMyPings(): Observable<Ad[]> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getMyPings`;

		const params = new HttpParams()
			.set('id', this.currentUser.id);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(ads => {
			ads.map(ad => this.mapAd(ad));
		})) as Observable<Ad[]>);
	}


}
