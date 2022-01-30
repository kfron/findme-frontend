import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { ExtendedNavigationExtras } from '@nativescript/angular/lib/legacy/router/router-extensions';
import { Color } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Observable, tap } from 'rxjs';
import { ApiPaths, environment } from './../../../../environment';
import { Finding } from './../models/map.model';
import { UserService } from './user.service';


@Injectable({
	providedIn: 'root'
})
export class MapService {
	private _searchRadiuses = [0.5, 1, 5];
	private _searchRadiusIndex = 0;

	public pathColor = new Color('#DD00b3fd');
	public circleStrokeColor = new Color('#2b6616');
	public circleFillColor = new Color(30, 106, 212, 68);

	baseUrl = environment.baseUrl;

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private routerExtensions: RouterExtensions) { }

	/**
	 * Mapuje pola zgłoszenia na ich poprawne odpowiedniki, usuwa niepotrzebne artefakty.
	 * 
	 * @param finding - napotkanie w surowej wersji
	 * @returns - poprawnie sformatowane napotkanie
	 */
	private mapFinding(finding): Finding {
		finding.found_at = new Date(finding.found_at);
		finding.position = Position.positionFromLatLng(finding.lat, finding.lon);
		delete finding.lat;
		delete finding.lon;

		return finding as Finding;
	}

	get searchRadius() {
		return this._searchRadiuses[this._searchRadiusIndex];
	}

	get searchRadiusIndex() {
		return this._searchRadiusIndex;
	}

	/**
	 * Przestawia promień poszukiwań na kolejną z trzech wartości.
	 */
	toggleSearchRadius() {
		this._searchRadiusIndex = (this._searchRadiusIndex + 1) % 3;
	}

	/**
	 * Funkcja opakowująca nawigowanie do innych stron.
	 * Dodaje do każdego konfigurację przejścia.
	 * 
	 * @param commands - docelowa ścieżka i parametry
	 * @param extras - dodatkowe komendy
	 */
	navigateTo(commands, extras?: ExtendedNavigationExtras) {
		this.routerExtensions.navigate(commands, {
			...extras,
			animated: true,
			transition: {
				name: 'slide',
				duration: 200,
				curve: 'ease',
			}
		});
	}

	/**
	 * Wysyła żądanie typu GET do serwera z prośbą o listę najbliższych napotkań.
	 * 
	 * @param lat - szerokość geograficzna
	 * @param lon - wysokość geograficzna
	 * @param dist - lista zgłoszeń w odległości promienia określonego w serwisie MapService 
	 * @returns - najbliższe napotkania
	 */
	getClosestTo(lat: number, lon: number, dist: number): Observable<Finding[]> {
		const url = `${this.baseUrl}/${ApiPaths.map}/getClosestTo`;
		const params = new HttpParams()
			.set('lat', lat)
			.set('lon', lon)
			.set('dist', dist);

		const observable = this.http.get(url, { params }) as Observable<any[]>;

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	/**
	 * Wysyła żądanie typu GET do serwera z prośbą o ścieżkę napotkań.
	 * 
	 * @param startId - zgłoszenie będące końcem ścieżki
	 * @returns - listę napotkań przedstawiającą ścieżkę
	 */
	getPath(startId: number): Observable<Finding[]> {
		const url = `${this.baseUrl}/${ApiPaths.map}/getPath`;
		const params = new HttpParams()
			.set('startId', startId);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	/**
	 * Wysyła żądanie typu GET do serwera z prośbą o najnowsze napotkanie konkretnego zgłoszenia.
	 * 
	 * @param adId - id zgłoszenia
	 * @returns najnowsze napotkanie dotyczące zgłoszenia o podanym id
	 */
	getNewestFinding(adId: number) {
		const url = `${this.baseUrl}/${ApiPaths.map}/getNewestFinding`;
		const params = new HttpParams()
			.set('adId', adId);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	/**
	 * Wysyła żądanie typu POST do serwera z prośbą o utworzenie nowego napotkania dla danego zgłoszenia.
	 * 
	 * @param adId - id zgłoszenia
	 * @param lat - szerokość geograficzna
	 * @param lon - wysokość geograficzna
	 */
	createFinding(adId: number, lat: number, lon: number) {
		const url = `${this.baseUrl}/${ApiPaths.map}/createFinding`;
		const userId = this.userService.currentUser.id;
		return (this.http.post(url, { adId, userId, lat, lon }));
	}
}
